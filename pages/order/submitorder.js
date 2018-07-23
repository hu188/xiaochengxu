const app = getApp();
import common from '/utils/common';
import util from '/utils/util';
Page({
  ...common,
  ...util,
  data: {
    buynum: 1,
    guid: '',
    paymentindex: ['0B43F2E3-34B0-49DD-B9BB-835A215334AD'],
    paymentarray: ['支付宝支付'],
    couponguid: '',
    cindex: 0,
    couponlimit: 0,
    couponcutdownarray: '',
    couponlimitarray: '',
    goodsList: [],
    order: {},
    totalPrice:0
  },
  onLoad: function (options) {
    const { goodsList } = app.globalData
    this.setData({
      goodsList
    })
    let totalPrice = 0
    goodsList.reduce((prev,cur)=>{
      totalPrice +=cur.costPrice*cur.count
    },0)
    this.setData({
      totalPrice
    })
     my.httpRequest({
        url: 'http://www.tianrenyun.com.cn/vendor/api/coupon/list',
        data: {
          "sessionKey": "53CD4E223DB1F91E"
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:  (r)=> {
          var couponinfo = r.data.data;
          var couponsguid = Array();
          var couponsname = Array();
          var coupondiscount = Array();//折扣
          var couponminimum = Array();//最低消费金额
          var couponcutdownarray = Array();
          var couponlimitarray = Array();
          var coupongoodsguid = Array();
          couponsguid[0] = "";
          couponsname[0] = '不使用优惠券';
          couponcutdownarray[0] = 0;
          couponlimitarray[0] = 0;
          var index = 0;
          for (var i in couponinfo) {
            index++;
            couponsguid[index] = couponinfo[i].id;
            couponsname[index] = couponinfo[i].couponName;
            coupondiscount[index] = couponinfo[i].discount;//折扣
            couponminimum[index] = couponinfo[i].minimum;//最低消费金额
            couponcutdownarray[index] = couponinfo[i].coupondiscount;
            couponlimitarray[index] = couponinfo[i].LIMITAMOUNT;
          }
          this.setData({
            couponindex: couponsguid,
            couponarray: couponsname,
            coupondiscount: coupondiscount,
            couponminimum: couponminimum,
            couponcutdownarray: couponcutdownarray,
            couponlimitarray: couponlimitarray,
            COUPONSTR: (couponinfo.length) + '张可用优惠券',
            ORDERAMOUNT: this.data.goodsamount
          });
        }
      });
  },
  onReady: function () {
    console.log('onReady');
  },
  submitOrderTap: function () {
    my.showLoading({
      content: '加载中',
    });
    var sessionKey = '53CD4E223DB1F91E'//用户sessionkey，暂用我的做测试
    const {goodsList} = this.data
    my.httpRequest({
      url: 'https://www.tianrenyun.com.cn/vendor/api/order/create', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: JSON.stringify({
        sessionKey:sessionKey,
        orderGoodsList:goodsList
      }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      success: (res) => {
        my.hideLoading();
        const {data} = res.data
        this.setData({
          order:data
        })
        this.pay(data.orderNo)
      }
    })
  },
  pay (orderNo) {
      my.httpRequest({
      url: 'https://www.tianrenyun.com.cn/vendor/api/pay/payOrder', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        sessionKey:'53CD4E223DB1F91E',
        orderNo: orderNo,
        type: 2
      },
      method: 'POST',
      success: (res) => {
        my.hideLoading();
        const {data} = res.data
        const {body} = data
        my.tradePay({
          orderStr: body,
          success: (res) => {
            console.log(res)
          },
          fail: (err)=>{
            console.log(err)
          }
        });
      }
    })
  },
  bindPaymentChange: function (e) {
    if (e.detail.value != '') {
      this.setData({
        paymentguid: this.data.paymentindex[e.detail.value],
        pindex: e.detail.value,
        PAYMENTSTR: this.data.paymentarray[e.detail.value]
      });
    }

  },
  bindCouponChange: function (e) {
    var that = this;
    if (e.detail.value != '' || e.detail.value == 0) {
      console.log(e.detail.value);
      console.log(this.data.couponindex[e.detail.value]);
      console.log(this.data.couponarray[e.detail.value]);
      console.log(this.data.couponcutdownarray[e.detail.value]);
      console.log(this.data.couponlimitarray[e.detail.value]);

      //当前折扣
      console.log(this.data.coupondiscount[e.detail.value]);
      console.log(this.data.couponminimum[e.detail.value]);

      var couponminimum = this.data.couponminimum[e.detail.value];//最低消费
      var coupondiscount = this.data.coupondiscount[e.detail.value];//优惠折扣

      console.log(that.data.goodsamount);
      console.log(couponminimum);

      if (parseFloat(that.data.goodsamount) >= parseFloat(couponminimum)) {

        console.log('进的优惠');

        //计算优惠券的优惠券金额
        var couponcutdown = that.data.goodsamount - that.data.goodsamount * coupondiscount / 100
      } else {
        console.log('进的不减优惠');
        var couponcutdown = 0;
      }

      //计算实际应该支付的价格
      var orderamount = parseFloat(that.data.goodsamount) - parseFloat(couponcutdown);

      this.setData({
        couponguid: this.data.couponindex[e.detail.value],
        cindex: e.detail.value,
        COUPONSTR: this.data.couponarray[e.detail.value],
        couponcutdown: couponcutdown,
        couponlimit: this.data.couponlimitarray[e.detail.value],
        ORDERAMOUNT: orderamount
      });

      if (e.detail.value == '0') {
        this.setData({
          usedcouponinfo: ''
        });
      } else {
        this.setData({
          usedcouponinfo: '优惠券优惠：- ￥' + parseFloat(that.data.couponcutdown).toFixed(2)
        });
      }
    }
  }

});