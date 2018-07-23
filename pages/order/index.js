//orderlist.js
// 获取应用实例
const app = getApp();
import common from '/utils/common';
import {http} from '../../utils/http'
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
    currentPageNum: 1
  },
  //事件处理函数
  bindViewTap: function () {
    my.navigateTo({
      url: '../logs/logs'
    })
  },
  getSystemInfoSyncPage() {
    this.setData({
      systemInfo: my.getSystemInfoSync()
    })
  },
  onLoad: function (e) {
    var that = this;
    my.setNavigationBar({
      title: '我的订单'
    });
    that.setData({
      waitpay: '',
      waitsend: '',
      waitget: '',
      done: '',
      allorder: 'border'
    });
    that.queryOrder(1);
  },
  //根据订单状态获取我的订单
  queryOrder: function (status) {
    const sessionKey = getApp().globalData.sessionkey
    http('order/query', {status, sessionKey},1).then(res => {
      console.log(res)
    })    
  },
  //订单状态切换
  choseorder: function (event) {
    var that = this;
    that.data.loaddesc = '';
    that.setData({
      orderlist: '',
      nodatainfo: '',
      noorderinfo: '',
      loaddesc: ''
    });
    var value = event.currentTarget.dataset.value;
    console.log(value);
    if (value != undefined) {
      var status = value;
      switch (value) {
        case '1':
          that.setData({
            waitpay: 'border',
            waitsend: '',
            waitget: '',
            done: '',
            allorder: ''
          });
          break;
        case '2':
          that.setData({
            waitpay: '',
            waitsend: 'border',
            waitget: '',
            done: '',
            allorder: ''
          });
          break;
        case '3':
          that.setData({
            waitpay: '',
            waitsend: '',
            waitget: 'border',
            done: '',
            allorder: ''
          });
          break;
        case '5':
          that.setData({
            waitpay: '',
            waitsend: '',
            waitget: '',
            done: 'border',
            allorder: ''
          });
          break;
      }
    } else {
      that.setData({
        waitpay: '',
        waitsend: '',
        waitget: '',
        done: '',
        allorder: 'border'
      });
    }
    console.log('status:' + status);

    that.data.orderlist = new Array();
    that.ajax_my_order(status);
  },
});