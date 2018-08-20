let app = getApp();
import { http } from '../../utils/http'
Page({
  data: {
   balance: 0
  },
  onLoad: function (e) {
    http('recharge/queryBalance', { sessionKey: getApp().globalData.sessionkey}, 1).then(res => {
      const { chargeMoney } = res
      this.setData({
        balance: chargeMoney
      })
    })
  }
});