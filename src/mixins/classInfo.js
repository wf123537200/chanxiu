import wepy from "wepy";
import getGlobalData from "../components/getGlobalData";
import {getClassDetail, joinClass, exitClass, applyClass} from "../modules/Classes";

export default class extends wepy.mixin {
    data = {
        classId: "",
        detail: {}
    };

    computed = {
        classLogo () {
            const logo = this.detail.logo;

            if (logo) {
                const global = getGlobalData(this);
                const {ajaxPerfix} = global.data;

                return `${ajaxPerfix}${logo}`;
            }

            return logo;
        },
        classQrCodeUrl () {
            const qrCodeUrl = this.detail.qrCodeUrl;

            if (qrCodeUrl) {
                const global = getGlobalData(this);
                const {ajaxPerfix} = global.data;

                return `${ajaxPerfix}${qrCodeUrl}`;
            }

            return qrCodeUrl;
        },
        isMonitor () {
            const role = this.detail.role;

            return role === 1;
        },
        isViceMonitor () {
            const role = this.detail.role;

            return role === 2;
        },
        isAdministrator () {
            return this.isMonitor || this.isViceMonitor;
        },
        isMyClass () {
            const role = this.detail.role;

            return role !== null && role !== undefined && role !== "";
        },
        noValidateOnApply () {
            return this.detail.addType === 0;
        }
    };

    methods = {
        async joinClass () {
            if (!this.noValidateOnApply) {
                this.$invoke("applyPopup", "show");
            }
            else {
                const result = await this.joinClass().catch(() => {
                    wx.showToast({
                        title: "加入失败"
                    });
                });

                wx.showToast({
                    title: "加入成功",
                    complete: () => {
                        this.detail.role = 0;
                        this.$apply();
                    }
                });
            }
        },
        async exitClass () {
            const result = await this.exitClass().catch(() => {
                wx.showToast({
                    title: "退出失败"
                });
            });

            wx.showToast({
                title: "退出成功",
                complete: () => {
                    this.detail.role = undefined;
                    this.$apply();
                }
            });
        }
    };

    getClassDetail = getClassDetail;

    joinClass = joinClass;

    applyClass = applyClass;

    exitClass = exitClass;

    onLoad(options) {
        if (options) {
            this.classId = options.id;
        }
    }
};