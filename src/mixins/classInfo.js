import wepy from "wepy";
import {getClassDetail, joinClass, exitClass, applyClass} from "../modules/Classes";

export default class extends wepy.mixin {
    data = {
        classID: "",
        detail: {}
    };

    computed = {
        isAdministrator () {
            return false;
        },
        isMyClass () {
            return !!(this.detail.myclass);
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
                        console.log(this.isMyClass);
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
            this.classID = options.id;
        }
    }
};