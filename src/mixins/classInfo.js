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
        isAdministrator () {
            const role = this.detail.role;

            return role > 0;
        },
        isMyClass () {
            const role = this.detail.role;

            return role !== null && role !== undefined;
        },
        noValidateOnApply () {
            //
            return this.detail.addType !== 0;
        }
    };

    methods = {
        async joinClass () {
            if (!this.noValidateOnApply) {
                this.$invoke("applyPopup", "show");
            }
            else {
                const result = await this.joinClass();

                if (result.isFail) {
                    wx.showToast({
                        title: "加入失败"
                    });
                } else {
                    wx.showToast({
                        title: "加入成功",
                        complete: () => {
                            // todo
                            this.detail.myclass = true;
                            this.$apply();
                        }
                    });
                }
            }
        },
        async exitClass () {
            const result = await this.exitClass();

            if (result.isFail) {
                wx.showToast({
                    title: "退出失败"
                });
            } else {
                wx.showToast({
                    title: "退出成功",
                    complete: () => {
                        // todo
                        this.detail.myclass = false;
                        this.$apply();
                    }
                });
            }
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