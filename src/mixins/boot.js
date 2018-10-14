import wepy from "wepy";

export default class extends wepy.mixin {
    data = {
        _bootFromMsg: false
    };

    computed = {
        bootFromMsg () {
            const bootFromMsg = wx.getStorageSync("bootFromMsg");
            return parseInt(bootFromMsg) === 1 || this._bootFromMsg;
        }
    };

    methods = {
        gotoClassListPage (e) {
            this.gotoClassListPage(e);
        },
        gotoSetExPage (e) {
            this.gotoSetExPage(e);
        }
    };

    gotoClassListPage (e) {
        wx.removeStorageSync("bootFromMsg");
        wx.switchTab({
            url: "/pages/class/list"
        });
    }
    gotoSetExPage (e) {
        wx.removeStorageSync("bootFromMsg");
        wx.switchTab({
            url: "/pages/setex"
        });
    }

    onLoad (options) {
        if (options) {
            const f = parseInt(options._f) === 1;

            this._bootFromMsg = f;

            if (f) {
                wx.setStorageSync("bootFromMsg", 1);
            }
        }

        wx.showShareMenu({
            withShareTicket: true
        });
    };
};
