//orderlist.js
// 获取应用实例
const app = getApp();
import common from '../../utils/common';
import { http } from '../../utils/http'
const {
  $Toast
} = require('../../components/base/index');
Page({
  ...common,
  data: {
    orderlist: [],
    nodatainfo: '',
    pagenum: 0,
    scroll_height: '800px',
    has_more: true, //是否有更多
    showlist: true, //是否显示滚动列表
    systemInfo: {},
    currentOrderType: '',
    currentPageNum: 1,
    selectIndex: 4,
    balance: 0
  },
  onLoad: function (e) {
    wx.hideTabBar()
    this.queryOrder(4);
    this.setData({
      balance: app.globalData.balance
    })
  },
  //根据订单状态获取我的订单
  queryOrder: function (status) {
    const sessionKey = getApp().globalData.sessionkey
    http('order/query', { status, sessionKey }, 1).then(res => {
      this.setData({
        orderlist: res
      })
    })
  },
  //订单状态切换
  choseorder: function (event) {
    const { value } = event.currentTarget.dataset
    this.setData({
      selectIndex: value
    })
    this.queryOrder(value)
  },
  view(e) {
    const { orderno } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../orderDetail/index?orderNo=${orderno}`,
    })
  },
  pay(e) {
    const sessionKey = getApp().globalData.sessionkey
    const { orderno, index } = e.currentTarget.dataset
    const { orderlist} = this.data
    const {balance} = app.globalData
    const order = orderlist[index]
    console.log(order)
  //  if (order.payment)
    const param = {
      sessionKey,
      orderNo: orderno,
      type: 1
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
            http('recharge/queryBalance', { sessionKey: sessionKey }, 1).then(res => {
              const { chargeMoney } = res
              const { selectIndex} = this.data
              app.globalData.balance = chargeMoney
              this.queryOrder(selectIndex)
            })
          }
        }
      })
    })
  }
});