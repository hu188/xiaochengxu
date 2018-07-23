//获取应用实例
const app = getApp();
//import common from '/utils/common';
import util from '/utils/util';
//import WxParse from '/wxParse/wxParse.js';
var WxParse = require('../../wxParse/wxParse.js');
Page({
  //...common,
  ...util,
  data: {
    imgUrls: ['http://romens-10034140.image.myqcloud.com/conew_88_w001000009_002.jpg?imageView2/0/w/640/format/png/q/100'],
    autoplay: true,
    interval: 5000,
    duration: 1000,
    buynum: 1,
    stockcount: 0,
    collectevent: 'doCollectTap',
    collecticon: 's-5',
    branchid: '',
    buymyself: 0,
    cartgoodssorts: 0,
    indicatorDots: false,
    IS_BRANCH_STOCK: app.globalData.IS_BRANCH_STOCK,
    branch_guid: '',
    branch_name: '当前门店',//当前门店
    branch_address: '',
    barcode: '',
    selected: true,
    selected1: false,
    selected2: false,
    commonprice: 0,
    shopping_imgurl: '',
    seckillid: '',
    isover: 0,
    goods: {},
    couponList: []
  },
  /*tab切换*/
  selected: function (e) {
    this.setData({
      selected1: false,
      selected2: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected2: false,
      selected1: true
    })
  },
  selected2: function (e) {
    this.setData({
      selected: false,
      selected2: true,
      selected1: false
    })
  },

  onLoad: function (e) {
    const { id } = e
    if (e.id != '' && e.id != undefined) {
      this.queryDetail(id)
      this.queryCouponList(id)
    }
  },
  /**增加数量 */
  productCountPlus: function () {
    let { buynum } = this.data
    buynum += 1
    this.setData({ buynum: buynum, cartgoodssorts: buynum });
    const { couponList, goods } = this.data
    if (couponList.length === 0 && !goods.couponList) {
      this.queryCouponList()
    }
  },
  /**查询商品的优惠券 */
  queryCouponList(id) {
    my.httpRequest({
      url: 'https://www.tianrenyun.com.cn/vendor/api/coupon/goodsCoupon',
      data: {
        sessionKey: '53CD4E223DB1F91E',
        goodsId: id
      },
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: (r) => {
        const { data } = r.data
        this.setData({
          couponList: data
        });
        my.hideLoading();
      }
    });
  },
  /**减少数量 */
  productCountMinus: function () {
    if (this.data.buynum <= 1) {
      my.showToast({
        type: 'fail',
        content: '最少购买一个!',
        duration: 1000
      });
      return;
    }
    var buynum = this.data.buynum - 1;
    this.setData({ buynum: buynum });
  },

  goIndexTap: function () {
    //回到首页
    my.switchTab({
      url: '../youxian/index'
    })
  },
  //跳转到提交订单页,立即支付购买功能
  goToAddrTap: function () {
    let { goods, buynum } = this.data
    goods['count'] = buynum
    goods.couponList= []
    getApp().globalData.goodsList = [goods]
    my.navigateTo({
      url: '../order/submitorder'
    })
  },
  goToCart: function () {
    my.navigateTo({
      url: '../cart/index'
    })
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '为您推荐' + app.globalData.projecttitle + '小程序',
      path: '/pages/youxian/goodsdetails?id=' + that.data.id,
      success: function (res) {
        console.log(that.data.id);
      },
      fail: function (res) {
      }
    }
  },
  queryDetail(id) {
    my.httpRequest({
      url: 'https://www.tianrenyun.com.cn/vendor/api/goods/queryGoodsDetail',
      data: {
        "goodsId": id
      },
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: (r) => {
        this.setData({
          goods: r.data.data,
        });
        my.hideLoading();
      }
    });
  }
});
