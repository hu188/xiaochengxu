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
    selectIndex: 3,
    balance: 0
  },
  onLoad: function (e) {
    wx.hideTabBar()
    this.queryOrder(3);
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
    const { formId} = e.detail
    const sessionKey = getApp().globalData.sessionkey
    const { orderno, index } = e.currentTarget.dataset
    const { orderlist} = this.data
    const order = orderlist[index]
    const {balance} = getApp().globalData
    const { payment} = order
    if (Number(payment) <= Number(balance)){
      const param = {
        orderNo: orderno,
        sessionKey: sessionKey
      }
      http('pay/balancePay', param, 1).then(res => {
        const { id } = res
        if (id) {
          app.globalData.goodsList = []
          $Toast({
            content: '支付成功',
            type: 'success'
          });
          getApp().sendTemplate(formId, order)
          getApp().queryBanlance()
          this.queryOrder(3);
        } else {
          $Toast({
            content: '支付失败',
            type: 'error'
          });
        }
      })
    return
    } 
    const params = {
      sessionKey,
      orderNo: orderno,
      type: 1
    }
    http('pay/payOrder', params, 1).then(res => {
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
            getApp().sendTemplate(formId, order)
            getApp().queryBanlance()
            this.queryOrder(3);
          }
        }
      })
    })
  },
  onShow (){
    getApp().queryBanlance()
    this.setData({
      balance: app.globalData.balance
    })
  }
});