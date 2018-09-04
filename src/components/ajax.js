import wepy from 'wepy'

export const ajax = function ({ins, url, params = {}, method = 'GET', success, fail}) {
    if (!ins) console.error('没有传入实体！');

    const {ajaxPerfix, resPerfix} = ins.globalData || ins.$parent.globalData;
    const token = url !== '/weixin/token' ? ins.accessToken || ins.$parent.accessToken : '';
    const getTokenPromise = ins.getTokenPromise || (ins.$parent && ins.$parent.getTokenPromise);

    if (!token && url !== "/weixin/token") {
        console.log(`请求${url}时未检测到token，等待/weixin/token完成再重新请求${url}。`);
        getTokenPromise.then(function () {
            ajax({ins, url, params, method, success, fail});
        });
    } else {
        console.log(`检测到token，发送请求到${url}。`);

        wx.getNetworkType({
            success: (res) => {
                const networkType = res.networkType
                if (networkType === 'none' || networkType === 'unkonwn' && method === 'GET') {
                    // 拿本地存储
                    const d = wx.getStorageSync(ajaxPerfix + url);
                    if (d) {
                        success && success(d)
                    } else {
                        fail ? fail() : wx.showToast({
                            title: data.data.msg || '调用接口失败',
                            icon: 'error',
                            duration: 2000,
                            mask: true
                        })

                        throw new Error(data.data.msg + ':' + url)
                    }
                } else {
                    wepy.request({
                        url: ajaxPerfix + url,
                        data: Object.assign(params, {'access_token': token}),
                        method,
                        header: {'content-type': 'application/x-www-form-urlencoded'}
                    }).then(data => {
                        if (data.data.code === 0) {
                            // 存储
                            if (method === 'GET') wx.setStorage({
                                key: ajaxPerfix + url,
                                data: data.data.data,
                                success: function (res) {
                                    console.log('本地存储 ' + ajaxPerfix + url + '成功')
                                }
                            })

                            success && success(data.data.data)
                        } else {
                            fail && fail()
                            if (data.data.code === 500211) {
                                wx.setStorage({
                                    key: 'token',
                                    data: {},
                                    success: function (res) {
                                        console.log('清除 token 成功')
                                        wx.reLaunch({url: '/pages/setex'})
                                    }
                                })
                            } else {
                                wx.showToast({
                                    title: data.data.msg || '调用接口失败',
                                    icon: 'error',
                                    duration: 2000,
                                    mask: true
                                })
                            }

                            throw new Error(data.data.msg + ':' + url)
                        }
                    })
                }
            }
        });
    }
};
