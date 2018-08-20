const app = getApp();
import common from '../..//utils/common';
import util from '../../utils/util';
import { http } from '../../utils/http'
Page({
  data: {
    order: {},
    paymentarray:['微信支付','余额支付'],
    paymentindex:0
  },
  onLoad: function (options) {
    const { orderNo } = options
    const sessionKey = getApp().globalData.sessionkey
    http('order/queryDetail', { sessionKey: sessionKey, orderNo:orderNo },1).then(res => {
      this.setData({
        order:res
      })
    })
  },
  pay() {
    const sessionKey = getApp().globalData.sessionkey
    const {orderNo} = this.data.order
    const param = {
      sessionKey,
      orderNo,
      type: 1
    }
    http('pay/payOrder', param, 1).then(res => {
      wx.requestPayment({
        timeStamp: '',
        nonceStr: '',
        package: '',
        signType: '',
        paySign: '',
        success:res=>{

        },
        fail: err =>{
          
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