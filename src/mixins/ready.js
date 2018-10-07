import wepy from "wepy";

export default class extends wepy.mixin {
    data = {
        ready: false,
        _error: false
    };

    readyCallbacks = [];

    hasReadyCallback(cb) {
        return this.readyCallbacks.some(n => n === cb);
    }

    addReadyCallback(promise) {
        if (!this.hasReadyCallback(promise)) {
            this.readyCallbacks.push(promise);
        }
    }

    async runReadyCallbacks() {
        this._error = false;

        wx.showLoading({
            title: "加载中..",
            mask: true
        });

        await Promise.all(this.readyCallbacks);
        this.ready = true;
        this.$apply();
        wx.hideLoading();
    }
};
