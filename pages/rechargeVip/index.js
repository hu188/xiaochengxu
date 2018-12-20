let app = getApp();
import { http } from '../../utils/http'
const {
  $Toast
} = require('../../components/base/index');
Page({
  data: {
    money:0,
    giveMoney:0,
    czlist: [
    ],
    isVip:'',
    endTime:''
  },
  onLoad: function (e) {
     this.data.sessionKey=app.globalData.sessionkey,
    http('qsq/service/external/recharge/queryBalance', { sessionKey: this.data.sessionKey }, 1).then(res => {
       this.setData({
         isVip: res.isvip,
       })
       if (res.strEndTime){
         this.setData({
           endTime: res.strEndTime,
         })
       }
    })
    //{type:1}
    http('qsq/service/external/vip/queryVipParam', app.globalData.type, 1).then(res => {
      if (res != ''){
        this.setData({
          money: res[0].money ?res[0].money :0,
          giveMoney: res[0].giveMoney ? res[0].giveMoney : 0
        })
      }
    })
  },
  
  czsave: function (t, a) {
    const param = {
      sessionKey: app.globalData.sessionkey,
      money: this.data.money,
      give: this.data.giveMoney,
      appid: app.globalData.id
    }
    
    http('qsq/service/external/recharge/rechargeVip', param, 1).then(res => {
      wx.requestPayment({
        timeStamp: res.timeStamp + '',
        nonceStr: res.nonceStr,
        package: 'prepay_id=' + res.prepay_id,
        signType: 'MD5',
        paySign: res.paySign,
        success: () =>{
          this.data.sessionKey = app.globalData.sessionkey,
            http('qsq/service/external/recharge/queryBalance', { sessionKey: this.data.sessionKey }, 1).then(res => {
            app.globalData.balance = res.chargeMoney/100
            })
          app.globalData.isVip = 1
          app.globalData.isFirstBuy = 1
          $Toast({
            content: '充值成功',
            type: 'success'
          });
          wx.switchTab({
            url: '../mycenter/index',
          })
        },
        fail:() =>{
          $Toast({
            content: '充值失败',
            type: 'error'
          });
        }
      })
    })
  }
});