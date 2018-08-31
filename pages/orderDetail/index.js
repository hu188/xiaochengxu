const app = getApp();
import common from '../..//utils/common';
import util from '../../utils/util';
import { http } from '../../utils/http'
const {
  $Toast
} = require('../../components/base/index');
Page({
  data: {
    order: {},
    paymentarray:['微信支付'],
    paymentindex:0,
    balance: 0
  },
  onLoad: function (options) {
    const { orderNo } = options
    const sessionKey = getApp().globalData.sessionkey
    http('order/queryDetail', { sessionKey: sessionKey, orderNo:orderNo },1).then(res => {
      this.setData({
        order:res
      })
    })
    this.setData({
      balance: app.globalData.balance
    })
  },
  pay() {
    const sessionKey = getApp().globalData.sessionkey
    const {orderNo} = this.data.order
    const param = {
      sessionKey,
      orderNo,
      type: 1,
      balance: 0
    }
    http('pay/payOrder', param, 1).then(res => {
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.packageValue,
        signType: res.signType,
        paySign: res.paySign,
        complete: res => {
          const {
            errMsg
          } = res
          if (errMsg === 'requestPayment:fail cancel') {
            $Toast({
              content: '支付失败',
              type: 'error'
            });
          } else {
            $Toast({
              content: '支付成功',
              type: 'success'
            });
            wx.navigateTo({
              url: '../order/index',
            })
          }
        }
      })
    })
  },
  changePay(e) {
    const { value } = e.detail
    this.setData({
      paymentindex: value
    })
  }
});