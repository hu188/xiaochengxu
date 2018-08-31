import { http } from './utils/http'
App({
  onLaunch(options) {
    this.queryType()
    this.checkAuth(res => {
      const data = this.checkLogin()
      if (data === '' && this.globalData.auth) {
        this.login()
      } else if (this.globalData.auth) {
        this.globalData.sessionkey = data
        wx.getUserInfo({
          success: (res) => {
            this.globalData.userInfo = res
          },
        });
      }
    })
  },
  //测试获取用户的guid
  login() {
    wx.login({
      scopes: 'auth_user',
      success: (res) => {
        wx.getUserInfo({
          success: result => {
            const data = {
              "jsCode": res.code,
              "type": "1",
              "storeType": this.globalData.type.type,
              "storeLevel": this.globalData.type.level,
              ...result
            }
            http('user/login', JSON.stringify(data), 1, 1).then(res => {
              const { sessionKey, userId } = res
              this.globalData.sessionkey = sessionKey
              this.globalData.userInfo = result
              wx.showToast({
                title: '登录成功！',
              })
              http('recharge/queryBalance', { sessionKey: sessionKey }, 1).then(res => {
                const { chargeMoney } = res
                this.globalData.balance = chargeMoney
              })
              wx.setStorage({
                key: 'sessionKey', // 缓存数据的key
                data: sessionKey // 要缓存的数据
              });
              if (!userId) {
                http('coupon/init', {sessionKey}, 1).then(res => {
                 console.log(res)
                })
              }
            })
          }
        })
      }
    })
  },
  checkAuth(callback) {
    wx.getSetting({
      success: (res) => {
        const { authSetting } = res
        if (authSetting['scope.userInfo']) {
          this.globalData.auth = true
          callback(0)
        } else {
          this.globalData.auth = false
          callback(1)
        }
        /*
         * res.authSetting = {
         *   "scope.userInfo": true,
         *   "scope.userLocation": true
         * }
         */
      }
    })
  },
  checkLogin() {
    const data = wx.getStorageSync('sessionKey');
    return data
  },
  showLoading(text = '加载中...') {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        content: text,
        success: (res) => {
          resolve()
        },
      });
    })
  },
  queryType() {
    return new Promise((resolve, reject) => {
      http('store/type', { "appId": "wx978041ffe305d125" }).then(res => {
        const { levelTypeId, type } = res
        this.globalData.type = { level: levelTypeId, type }
        resolve({ level: levelTypeId, type })
      })
    })
  },
  globalData: {
    userInfo: null,
    user_id: '',//支付宝userid
    projecttitle: '天任售货机平台',
    appid: 'wx978041ffe305d125',
    appsecret: '',
    isGetedAuth: 0,//是否获取到授权
    isCanceledAuth: 0,//是否取消了授权
    hostname: 'https://www.tianrenyun.com.cn',
    imgPath: 'https://www.tianrenyun.com/qsqFile/filelib/imagelib/dealerlib/',
    isNeedLogin: 0,//0为不需要登录，1为需要手机号验证码登录
    goodsList: [], //结算时选中的商品,
    type: {},
    sessionkey: '',
    auth: false,
    balance: 0
  },
});
