// pages/index/scancode.js
//获取应用实例
const app = getApp();
Page({
  data: {
    bindevent: ''
  },

  onLoad: function () {
    my.setNavigationBar({
      title: '优惠券领取'
    });
    var that = this;
    console.log('1212');
    ali_coupon_list(that);
  },
  onShow(e) {
    var that = this;
    //ali_coupon_list(that);

  },

  //显示详细信息
  getcouponinfo: function (e) {
    // console.log(e.currentTarget.dataset)
    const animation = my.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.animation = animation;
    animation.top('0px').step();
    this.setData({
      animationData: animation.export(),
      couponname: e.currentTarget.dataset.couponname,
      endtime: e.currentTarget.dataset.endtime,
      price: e.currentTarget.dataset.price,
      starttime: e.currentTarget.dataset.starttime,
      useofrange: e.currentTarget.dataset.useofrange,
      detailedurl: e.currentTarget.dataset.detailedurl,
    })

  },
  //关闭详细信息
  closecouponinfo: function (e) {
    console.log(54545);
    var animation = my.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.animation = animation;
    animation.top('1000px').step();
    this.setData({
      animationData: animation.export()
    })
  }
})

//获取优惠券列表方法封装
function ali_coupon_list(that) {

  my.httpRequest({
    url: 'http://www.tianrenyun.com.cn/vendor/api/coupon/list',
    data: {
      "sessionKey": "53CD4E223DB1F91E"
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log('优惠券列表');
      console.log(res.data);

      my.hideLoading();
      that.setData({
        couponinfo: res.data.data
      });

    },
    fail: function () {
      my.hideLoading();
    }
  });
}