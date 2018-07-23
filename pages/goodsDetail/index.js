//获取应用实例
const app = getApp();
//import common from '/utils/common';
import util from '/utils/util';
import { http } from '../../utils/http'
var WxParse = require('../../wxParse/wxParse.js');
Page({
  //...common,
  ...util,
  data: {
    banners: [],
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
    const sessionKey = getApp().globalData.sessionkey
    http('coupon/goodsCoupon', {
      sessionKey: sessionKey,
      goodsId: id
    }, 1).then(res => {
      this.setData({
        couponList: res
      });
    })
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
      url: '../home/index'
    })
  },
  //跳转到提交订单页,立即支付购买功能
  goToAddrTap: function () {
    let { goods, buynum } = this.data
    goods['count'] = buynum
    goods.couponList = []
    getApp().globalData.goodsList = [goods]
    my.navigateTo({
      url: '../submitOrder/index'
    })
  },
  goToCart: function () {
    my.navigateTo({
      url: '../cart/index'
    })
  },
  // onShareAppMessage: function () {
  //   return {
  //     title: '为您推荐' + app.globalData.projecttitle + '小程序',
  //     path: '/pages/goodsdetails?id=' + that.data.id,
  //     success: function (res) {
  //       console.log(that.data.id);
  //     },
  //     fail: function (res) {
  //     }
  //   }
  // },
  /**查询商品详情 */
  queryDetail(id) {
    http('goods/queryGoodsDetail', { "goodsId": id }, 1).then(res => {
      let {banners} = this.data
      const path = getApp().globalData.imgPath + res.id + '.jpg'
      banners.push(path)
      this.setData({
        goods: res,
        banners
      });
    })
  }
});
