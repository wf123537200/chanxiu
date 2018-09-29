import wepy from "wepy";
import {collectFormId} from "../modules/Common";
import {getClassDetail, joinClass, exitClass, applyClass, deleteClass} from "../modules/Classes";

export default class extends wepy.mixin {
    data = {
        classId: "",
        detail: {}
    };

    computed = {
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
                await this.joinClass();

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
            await this.exitClass();

            wx.showToast({
                title: "退出成功",
                complete: () => {
                    this.detail.role = undefined;
                    this.$apply();
                }
            });
        },
        async deleteClass (e) {
            let msgType = 10;

            await (collectFormId.bind(this)({
                formId: e.detail.formId,
                page: "/pages/class/detail?id=" + this.classId,
                type: msgType
            })).catch(() =>{});

            await this.deleteClass().catch(() => {
                wx.showToast({
                    title: "操作失败"
                });

                throw "班级解散失败";
            });

            wx.showToast({
                title: "班级已解散",
                complete: () => {
                    wx.switchTab({
                        url: "/pages/class/index"
                    });
                }
            });
        }
    };

    async getClassDetail () {
        await getClassDetail.bind(this)();
        this.$apply();
    };

    async joinClass () {
        await joinClass.bind(this)();
        wx.navigateTo({
            url: "/pages/class/welcome?id=" + this.classId
        });
    };

    async applyClass () {
        await applyClass.bind(this)();
        this.$apply();
    };

    async exitClass () {
        await exitClass.bind(this)();
        this.$apply();
    };

    async deleteClass () {
        await deleteClass.bind(this)();
        this.$apply();
    };

    onLoad(options) {
        if (options) {
            this.classId = options.id;
        }
    }
};