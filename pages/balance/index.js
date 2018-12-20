let app = getApp();
import { http } from '../../utils/http'
Page({
  data: {
   balance: 0
  },
  onLoad: function (e) {
    http('qsq/service/external/recharge/queryBalance', { sessionKey: getApp().globalData.sessionkey}, 1).then(res => {
      const { chargeMoney } = res
      this.setData({
        balance: chargeMoney/100
      })
      app.globalData.balance = chargeMoney / 100
    })
  },
  onShow(){
    app.globalData.balance=this.data.balance
  }

});