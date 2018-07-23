import { http } from './utils/http'
App({
  async onLaunch(options) {
    await this.queryType()
    my.getStorage({
      key: 'sessionKey',
      success: (res) => {
        const { data } = res
        if (data === undefined) {
        this.login()
        } else {
          this.globalData.sessionkey = data
           my.getAuthUserInfo({
            success: (res) => {
             this.globalData.userInfo = res
            },
          });
        }
      },
    });
  },
  //测试获取用户的guid
  login() {
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        const data = {
          "jsCode": res.authCode,
          "type": "2",
          "storeType": this.globalData.type.type,
          "storeLevel": this.globalData.type.level,
        }
        http('user/login', JSON.stringify(data), 1, 1).then(res => {
          const { sessionKey, userId } = res
          this.globalData.sessionkey = sessionKey
            my.getAuthUserInfo({
            success: (res) => {
              this.globalData.userInfo = res
            },
          });
          my.setStorage({
            key: 'sessionKey', // 缓存数据的key
            data: sessionKey // 要缓存的数据
          });
        })
      }
    })
  },
  async queryType() {
    await http('store/type', { "appId": "2018061360353335" }, 1).then(res => {
      const { levelTypeId, type } = res
      this.globalData.type = { level: levelTypeId, type }
    })
  },
  globalData: {
    userInfo: null,
    user_id: '',//支付宝userid
    projecttitle: '天任售货机平台',
    appid: '2018061360353335',
    appsecret: '',
    isGetedAuth: 0,//是否获取到授权
    isCanceledAuth: 0,//是否取消了授权
    alipay_user_id: '', //支付宝获取的uid
    getting_userinfo: 0,//获取用户信息中,=1
    goods_id: '',
    hostname: 'https://www.tianrenyun.com.cn',
    isNeedLogin: 0,//0为不需要登录，1为需要手机号验证码登录
    goodsList: [], //结算时选中的商品,
    type: {},
    sessionkey: ''
  },
});
