const app = getApp();
import common from '../../utils/common';
import util from '../../utils/util';
import {
  http
} from '../../utils/http'
const {
  $Toast
} = require('../../components/base/index');
Page({
  ...common,
  ...util,
  data: {
    buynum: 1,
    guid: '',
    paymentarray: ['微信支付','余额支付'],
    couponguid: '',
    cindex: 0,
    goodsList: [],
    order: {},
    totalPrice: 0,
    couponList: [],
    paymentindex: 0,
    couponIndex: 0,
    realPrice: 0,
    balance: 0,
    coupon:{}
  },
  onLoad: function (options) {
    const {
      goodsList
    } = app.globalData
    this.setData({
      goodsList
    })
    let totalPrice = 0
    goodsList.reduce((prev, cur) => {
      totalPrice += cur.retailPrice * cur.count - cur.discount
    }, 0)
    this.setData({
      totalPrice: totalPrice,
      realPrice: totalPrice
    })
    const sessionKey = getApp().globalData.sessionkey
    http('recharge/queryBalance', { sessionKey: sessionKey }, 1).then(res => {
      const { chargeMoney } = res
      this.setData({
        balance: chargeMoney
      })
    })

    http('coupon/all', {
      sessionKey: sessionKey
    }, 1).then(res => {
      res = res.filter(item => {
        return item.minimum * 1 <= totalPrice
      })
      res.unshift({
        couponName: '不使用优惠券',
        id: -1,
        couponType: 1,
        discount: 0
      })
      this.setData({
        couponList: res
      })
    })
  },
  submitOrderTap: function () {
    const sessionKey = getApp().globalData.sessionkey //用户sessionkey，暂用我的做测试
    const {
      goodsList,
      coupon
    } = this.data
    const param = JSON.stringify({
      sessionKey: sessionKey,
      orderGoodsList: goodsList,
      coupon: coupon
    })
    http('order/create', param, 1, 1).then(res => {
      this.setData({
        order: res
      })
      this.pay(res.orderNo)
    })
  },
  pay(orderNo) {
    const sessionKey = getApp().globalData.sessionkey
    const { paymentindex, balance, totalPrice } = this.data
    if (paymentindex * 1 === 1) { //余额支付
      if (totalPrice <= balance) {
        const param = {
          orderNo: orderNo,
          balance:totalPrice,
          sessionKey: sessionKey
        }
        http('pay/balancePay', param, 1).then(res => {
          const {code} = res
          if (code === 200) {
            $Toast({
              content: '支付成功',
              type: 'success'
            });
            wx.navigateTo({
              url: '../order/index',
            })
          } else {
            $Toast({
              content: '支付失败',
              type: 'error'
            });
          }
        })
      }
    } else {
      const param = {
        sessionKey,
        orderNo,
        type: 1,
        balance: paymentindex * 1 === 1 ? balance : 0
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
    }
  },
  bindCouponChange (e) {
    const {
      value
    } = e.detail
    let {
      totalPrice
    } = this.data
    this.setData({
      couponIndex: value
    })
    const {
      couponList
    } = this.data
    const coupon = couponList[value]
    const {
      couponType,
      discount
    } = coupon
    if (couponType * 1 === 1) { //折扣券
      totalPrice -= totalPrice - totalPrice * discount * 0.01
    } else { //抵用券
      totalPrice = totalPrice - discount
    }
    this.setData({
      realPrice: totalPrice,
      coupon: coupon
    })
  },
  bindPaymentChange(e) {
    const { value } = e.detail
    this.setData({
      paymentindex: value
    })
  }
});