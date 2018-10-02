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
        }
    };

    gotoClassListPage (e) {
        wx.setStorage({
            key: "bootFromMsg",
            data: 0,
            complete () {
                wx.switchTab({
                    url: "/pages/class/list"
                });
            }
        });
    }

    onLoad (options) {
        if (options) {
            const f = parseInt(options._f) === 1;

            if (f) {
                wx.setStorageSync("bootFromMsg", 1);
            }
            this._bootFromMsg = f;

            console.log("options._f:", options._f);
            console.log("bootFromMsg:", this._bootFromMsg);
        }

        wx.showShareMenu({
            withShareTicket: true
        });
    };
};