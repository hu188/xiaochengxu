let app = getApp();
import { http } from '../../utils/http'
const {
  $Toast
} = require('../../components/base/index');
Page({
  data: {
    xz: 0,
    czlist: [
    ]
  },
  onLoad: function (e) {
    console.log(app.globalData)
    http('recharge/index', app.globalData.type, 1).then(res => {
      this.setData({
        czlist: res
      })
    })
  },
  xuanz: function (e) {
    var t = this, a = e.currentTarget.dataset.id;
    t.setData({
      xz: a
    });
  },
  czsave: function (t, a) {
    const { czlist, xz} = this.data
    const item = czlist[xz]
    const {money, giveMoney} = item
    const param = {
      sessionKey: app.globalData.sessionkey,
      totalFee: money,
      give: giveMoney
    }
    http('recharge/recharge', param, 1).then(res => {
      const { nonceStr, packageValue, paySign, signType, timeStamp} = res
      wx.requestPayment({
        timeStamp: timeStamp,
        nonceStr: nonceStr,
        package: packageValue,
        signType: signType,
        paySign: paySign,
        success: () =>{
          http('recharge/queryBalance', { sessionKey: sessionKey }, 1).then(res => {
            const { chargeMoney } = res
            app.globalData.balance = chargeMoney
          })
          $Toast({
            content: '充值成功',
            type: 'success'
          });
          wx.navigateBack()
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