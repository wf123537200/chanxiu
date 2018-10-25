/**
 * Created by 黄帅 on 2018/10/25.
 */

export function getTimeInfo (cost) {
    let hour;
    let minute;
    let second;

    hour = Math.floor(cost / 3600);
    cost -= hour * 3600;
    minute = Math.floor(cost / 60);
    cost -= minute * 60;
    second = cost;

    return {
        hour,
        minute,
        second
    }
}

export function end (inExPage, cost) {
    let target = this;

    if (inExPage) {
        cost = this.cost;
        target = this.$parent;

        this.stopTiming();
        this.wake();
        wx.stopBackgroundAudio();
    }

    let {hour, minute, second} = getTimeInfo(cost);

    const exTime = target.globalData.exTime = hour * 60 + minute;

    const submitData = target.globalData.submitData = {
        timeSet: exTime * 60,
        trainMethodIds: target.globalData.trainMethodIds,
        musicId: target.globalData.musicId,
        addDuration: 0
    };

    wx.getNetworkType({
        success: (res) => {
            const networkType = res.networkType
            if (networkType === 'none' || networkType === 'unkonwn') {
                const etoaArr = wx.getStorageSync('exTimeOfflineArray') || []
                const extentObj = etoaArr.find(e => e.timeSet == submitData.timeSet && e.trainMethodIds == submitData.trainMethodIds)
                if (!extentObj) {
                    etoaArr.push(submitData)

                    wx.setStorage({
                        key: 'exTimeOfflineArray',
                        data: etoaArr,
                        success: function (res) {
                            console.log('本地存储 exTimeOfflineArray 成功')
                        }
                    })
                }
            }
        }
    });

    playAudio(target.globalData.resPerfix + '/res/music/end.mp3', 'end');

    // 跳转
    target.globalData.musicUrl = '';
    target.globalData.musicTitle = '';
    wx.removeStorageSync("ex_background");

    if (inExPage) {
        wx.redirectTo({
            url: "/pages/end"
        });
    }
    else {
        wx.navigateTo({
            url: "/pages/end"
        });
    }
}

export function playAudio (src, title, onEnded) {
    console.log(src + '' + title)
    const am = wx.getBackgroundAudioManager()
    am.onError((e) => {
        console.error(e)
    })
    am.onPlay(() => {
    })
    am.onEnded(() => {
        onEnded && onEnded()
    })
    am.title = title || src
    am.src = src
}
