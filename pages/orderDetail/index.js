const app = getApp();
import common from '../..//utils/common';
import util from '../../utils/util';
import { http } from '../../utils/http'
const {
  $Toast
} = require('../../components/base/index');
Page({
  data: {
    orders:[],
    paymentarray: ['微信支付', '余额支付'],
    paymentindex:0,
    balance: 0,
    deviceName:'',
    totalMoney:'',
    orderNo:''
  },
  onLoad: function (options) {
    const { orderNo, totalMoney } = options
    this.setData({
      deviceName: app.globalData.deviceName,
      totalMoney: totalMoney,
      orderNo: orderNo
    })
    
    const sessionKey = getApp().globalData.sessionkey
    http('qsq/service/external/order/queryDetail', { sessionKey: sessionKey, orderNo:orderNo },1).then(res => {
      this.setData({
        orders:res,
      })
    })
    this.setData({
      balance: app.globalData.balance
    })
  },
  pay() {
    http('qsq/service/external/device/queryStatus', { sign: app.globalData.sign, id: app.globalData.id }, 1).then(res => {
      if (res == '') {
    const sessionKey = getApp().globalData.sessionkey
    const { orderNo, paymentindex, totalMoney, balance} = this.data
    if (paymentindex==1){
      //余额支付
      if (totalMoney <= balance){//余额大于支付金额
        const param = {
          orderNo: orderNo,
          sessionKey: sessionKey
        }
        //余额支付
        http('qsq/service/external/pay/balancePay', param, 1).then(res => {
          const { id } = res
          if (id) {
            app.globalData.goodsList = []
            $Toast({
              content: '支付成功',
              type: 'success'
            });
            app.globalData.isFirstBuy = 0
            http('qsq/service/external/user/updateUser', { sessionKey: sessionKey }, 1).then(res => {
              const { chargeMoney } = res
              this.setData({
                balance: chargeMoney / 100
              })
              app.globalData.balance = chargeMoney / 100
            })  
            //发送报文
            http('qtg/service/external/chat/send', {
              deviceId: app.globalData.deviceId,
              userId: app.globalData.userId, orderNo: orderNo, money: this.data.totalMoney * 100,send:0
            }, 1).then(res => {
            })
            wx.clearStorageSync();
            wx.switchTab({
              url: '../order/index',
            })

          } else {
            $Toast({
              content: '支付失败',
              type: 'error'
            });
          }
        })
      } else {//余额小于支付金额
        $Toast({
          content: '余额不足',
          type: 'error'
        });
      }
    }else{
      //微信支付
    const param = {
      userId:app.globalData.userId,
      orderNo,
      type: 1,
      tp: app.globalData.tp,
      appid: app.globalData.id
    }
      http('qsq/service/external/pay/getWeChatPayInfo', param, 1).then(res => {
        wx.requestPayment({
          timeStamp: res.timeStamp + '',
          nonceStr: res.nonceStr,
          package: 'prepay_id=' + res.prepay_id,
          signType: 'MD5',
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
              wx.clearStorageSync();
              app.globalData.goodsList = []
              wx.switchTab({
                url: '../order/index',
              })
            }
          }

        });
     })
    }
      }else{
        $Toast({
          content: res,
          type: 'error'
        });
      }
    })
  },
  changePay(e) {
    const { value } = e.detail
    this.setData({
      paymentindex: value
    })
  }

});