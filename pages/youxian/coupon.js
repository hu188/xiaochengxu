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
    my.httpRequest({
      url: 'https://www.tianrenyun.com.cn/vendor/api/coupon/list',
      data: {
            "stpSession": "3D8C325FDB947BCD"
          },
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },

      success: (res) => {
        console.log('2323');
        console.log(res.data);
      }
    })
    //ali_coupon_list(that);
  },
  onShow(e) {
     var that = this;
    //ali_coupon_list(that);

    },

  //领取优惠券
  getcoupon: function (e) {
    var couponid = e.currentTarget.dataset.getcouponid;
    console.log(couponid);

    var that = this;
    var post_data = {
      'QueryType': 'ali_get_coupon',
      'UserGuid': app.globalData.UserGuid,
      'Params': '{"orgguid":"' + app.globalData.orgguid + '","openid":"' + app.globalData.user_id + '","guid":"' + couponid + '"}'
    };
    my.httpRequest({
      url: app.globalData.hostname + '/quickProjectAPI',
      data: post_data,
      method: 'POST',
      //header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      //success: function (r) {
      success: (res) => {
        var returninfo = res.data.msg;
        var returnstate = res.data.num;

        my.confirm({
          title: '提示信息',
          content: returninfo,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          success: (result) => {
            // my.alert({
            //     title: `${result.confirm}`,
            //   });
          },
        });

        //不能进行dom操作，所以在循环读一遍
        var post_data1 = {
          'QueryType': 'show_coupon',
          'UserGuid': app.globalData.UserGuid,
          'Params': '{"orgguid":"' + app.globalData.orgguid + '","openid":"' + app.globalData.user_id + '"}'
        };
        my.httpRequest({
          url: app.globalData.hostname + '/quickProjectAPI',
          data: post_data1,
          method: 'POST',
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          success: (res) => {
            my.hideLoading();
            console.log('---------------------');
            console.log(res.data);
            console.log('---------------------');

            that.setData({
              userinfo: res.data.user_coupon_num,
              goodsinfo: res.data.coupon_goods,
              couponinfo: res.data.valqs
            });
          },
          fail: function () {

          }
        });

      },
      fail: function () {

      }
    });
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
    data: {stpSession:'3D8C325FDB947BCD'},
    method: 'POST',
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    success: (res) => {
    console.log('优惠券列表');
    console.log(res.data);

      my.hideLoading();
      // that.setData({
      //   userinfo: res.data.user_coupon_num,
      //   goodsinfo: res.data.coupon_goods,
      //   couponinfo: res.data.valqs
      // });

    },
    fail: function () {
      my.hideLoading();
    }
  });
}