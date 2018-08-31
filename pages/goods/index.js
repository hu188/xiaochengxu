//获取应用实例
const app = getApp();
import common from '../../utils/common';
import { http } from '../../utils/http';
const {
  $Toast
} = require('../../components/base/index');
Page({
  ...common,
  data: {
    types: [],
    list: [],
    selectType: -1,
    count: 0,
    total: 0,
    selectGoods: [],
    discount: 0,
    auth: false,
  },
  onLoad(e) {
    this.setData({
      auth: app.globalData.auth
    })
    const sessionKey = getApp().globalData.sessionkey
    if (sessionKey) {
      http('recharge/queryBalance', { sessionKey: sessionKey }, 1).then(res => {
        const { chargeMoney } = res
        app.globalData.balance = chargeMoney
      })
    }

    wx.hideTabBar()
    const { type } = getApp().globalData
    if (!type.level) {
      app.queryType().then(res => {
        this.queryList(res)
      })
    } else {
      this.queryList(app.globalData.type)
    }
  },
  queryList(type) {
    http('goods/typeList', type, 1).then(res => {
      if (res.length > 0) {
        const { id } = res[0]
        this.queryChild(id)
        this.setData({
          types: res,
          selectType: id
        })
      }
    })
  },
  typeHand(e) {
    const { id } = e.currentTarget.dataset
    this.queryChild(id)
    this.setData({
      selectType: id
    })
  },
  queryChild(id) {
    const { type } = getApp().globalData
    const param = {
      CommodityType: id,
      type: type.type,
      level: type.level
    }
    http('goods/list', param, 1).then(res => {
      this.setData({
        list: res
      })
    })
  },
  //搜索功能
  showSearch: function (ev) {
    var hides = this.data.hideClass == "hideClass" ? "" : "hideClass";
    var shows = this.data.showClass == "showClass" ? "" : "showClass";
    var showCancel = this.data.showCancel == "showCancel" ? "" : "showCancel";
    this.setData({
      hideClass: hides,
      showClass: shows,
      showCancel: showCancel
    });
  },

  closeCancel: function (ev) {
    var hides = this.data.hideClass == "hideClass" ? "" : "hideClass";
    var shows = this.data.showClass == "showClass" ? "" : "showClass";
    var showCancel = this.data.showCancel == "showCancel" ? "" : "showCancel";
    this.setData({
      hideClass: hides,
      showClass: shows,
      showCancel: showCancel
    });
  },

  btn: function (ev) {
    var that = this;
    var search_con = ev.detail.value;
    if (search_con == '') {
      wx.showToast({
        title: '请输入搜索内容',
        duration: 3000,
      });
      return;
    }
    wx.navigateTo({
      url: '../goods/goodslist?search_con=' + search_con
    });
  },

  //点击三级分类跳转商品列表
  queryDetail: function (event) {
    const { dataset } = event.currentTarget
    const { id } = dataset
    if (id != '') {
      wx.navigateTo({
        url: '../goodsDetail/index?id=' + id
      });
    }
  },
  submitHandler() {
    const { total } = this.data
    if (total > 0) {
      getApp().globalData.goodsList = this.data.selectGoods
      wx.navigateTo({
        url: '../submitOrder/index'
      });
    } else {
      $Toast({
        content: '请选择商品！',
        type: 'error'
      });
    }
  },
  changeNumber({ detail, target }) {
    const { item } = target.dataset
    let { list, count, total, discount } = this.data
    const { value, type } = detail
    const { index } = target.dataset
    let goods = list[index]
    if (type === 'plus') {
      count++
    } else {
      count--
    }
    goods['count'] = value
    goods['coupons'] = item
    const { coupons } = goods
    if (coupons && coupons.id) {
      const { couponType } = coupons
      if (couponType * 1 === 5) {
        goods['discount'] = goods.count * goods.retailPrice - goods.count * goods.retailPrice * coupons.discount * 0.01
      } else if (couponType * 1 === 6) {
        goods['discount'] = coupons.discount
      }
    } else {
      goods['discount'] = 0
    }
    list[index] = goods
    const selectGoods = list.filter(item => item.count && item.count > 0)
    let totalPrice = selectGoods.reduce((total, cur) => {
      return cur.count * cur.retailPrice - cur.discount + total
    }, 0)
    let num = selectGoods.reduce((total, cur) => {
      return cur.count + total
    }, 0)
    let disc = selectGoods.reduce((prev, cur) => {
      return cur.discount * 1 + prev
    }, 0)
    this.setData({
      list,
      count: num,
      total: totalPrice,
      discount: disc,
      selectGoods: selectGoods
    })
  },
  getUserInfoFun(e) {
    const { errMsg } = e.detail
    if (errMsg === 'getUserInfo:ok') {
      this.setData({
        auth: true
      })
      app.login()
    }
  },
  onShow (){
   const {goodsList} = app.globalData
   if (goodsList.length === 0) {
     this.setData({
       total:0,
       discount: 0,
       count: 0
     })
   }
  }
})