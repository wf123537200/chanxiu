import wepy from 'wepy';
import getGlobalData from "./getGlobalData";

export const ajax = function ({ins, url, params = {}, method = 'GET', success, fail}) {
  if(!ins) console.error('没有传入实体！');
  let _global = getGlobalData(ins);
  let globalData = _global.data;
  const {ajaxPerfix, resPerfix, formIds} = globalData;

  const d = wx.getStorageSync('token')
  //const token = url !== '/weixin/token' ? ins.accessToken || (ins.$parent ? ins.$parent.accessToken || d.accessToken || '' : '') : '';
  let token = url !== '/weixin/token' ? _global.ins.accessToken || d.accessToken : "";

  wx.getNetworkType({
    success: async (res) => {
      const networkType = res.networkType
      if(networkType === 'none' || networkType === 'unkonwn' && method === 'GET') {
        globalData.hasNetwork = false;
        // 拿本地存储
        const data = wx.getStorageSync(ajaxPerfix + url);

        if(data) {
          success && success(data)
        } else {
          if (typeof data != 'string') {
            const message = data && data.data ? data.data.msg : '调用接口失败'
            fail ? fail() : wx.showToast({
              title: message,
              icon: 'error',
              duration: 2000,
              mask:true
            })
          }
        }
      } else {
        if (ins.saveFormIds && formIds && formIds.length && url !== "/template/message/collect") {
          console.log("--准备发送formId--");
          await ins.saveFormIds();
          console.log("--formId已发送，执行业务请求--");
        }

        if (url === '/weixin/token') {
            console.log("开始请求token接口：");
        }

        wepy.request({url: ajaxPerfix + url, data: Object.assign(params, {'access_token': token}), method, header: {'content-type': 'application/x-www-form-urlencoded'}}).then(data => {
          if(data.data.code === 0) {
            // 存储
            if(method === 'GET') wx.setStorage({
              key: ajaxPerfix + url,
              data: data.data.data,
              success: function(res){
                console.log('本地存储 ' + ajaxPerfix + url + '成功')
              }
            })
            success && success(data.data.data)
          } else {
            if (method === 'GET') {
              wx.removeStorageSync(ajaxPerfix + url);
            }
            fail && fail(data);
            if(data.data.code === 500211) {
                wx.setStorage({
                key: 'token',
                data: {},
                success: function(res){
                  console.log('清除 token 成功')
                  wx.reLaunch({url: '/pages/setex'})
                }
              })
            }
            else {
              wx.showToast({
                title:  data.data.msg || '调用接口失败',
                icon: 'error',
                duration: 2000,
                mask:true
              })
            }

            //throw new Error(data.data.msg + ':' + url)
          }
        })
      }
    }
  })
}
