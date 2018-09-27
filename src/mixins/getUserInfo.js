import wepy from "wepy";

export default class extends wepy.mixin {
    data = {
        userInfo: {}
    };

    getUserInfo(cb) {
        return new Promise((resolve, reject) => {
            this.$parent.getUserInfo((userInfo) => {
                this.userInfo = userInfo;
                this.$apply();

                if (typeof cb === "function") {
                    resolve(cb());
                }
                else {
                    resolve();
                }
            });
        });
    }
};
