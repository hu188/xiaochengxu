//orderlist.js
// 获取应用实例
const app = getApp();
import common from '/utils/common';
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
    var status = 0;//0代表获取全部订单     
    that.ajax_my_order(status);
  },
  //根据订单状态获取我的订单
  ajax_my_order: function (status) {
    var that = this;
    my.showLoading({
      content: '加载中...',
    });
    console.log('进入到获取订单页面');
    console.log(status);
    my.httpRequest({
      url: 'https://www.tianrenyun.com.cn/vendor/order/query',
      data: {
        "status": status
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json'}, // 设置请求的 header
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("--------------res.data------------");
        console.log(res.data);
        console.log("--------------res.data------------");
        that.setData({
          loaddesc: that.data.loaddesc
        });
      },
      fail: function () {
        my.hideLoading();
        // fail
      },
      complete: function () {
        my.hideLoading();
        // complete
      }
    });
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