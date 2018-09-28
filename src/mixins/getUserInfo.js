import wepy from "wepy";

export default class extends wepy.mixin {
    data = {
        userInfo: {}
    };

    onGetUserInfo (e) {
        if (e.detail.userInfo) {

        }
    }

    async getUserInfo(cb) {
        //const
        return new Promise((resolve, reject) => {
            this.$parent.getUserInfo((userInfo = {}) => {
                this.userInfo = Object.assign({}, userInfo);
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
