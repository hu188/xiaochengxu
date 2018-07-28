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
    currentPageNum: 1,
    selectIndex: 1
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
    my.setNavigationBar({
      title: '我的订单'
    });
    this.queryOrder(1);
  },
  //根据订单状态获取我的订单
  queryOrder: function (status) {
    const sessionKey = getApp().globalData.sessionkey
    http('order/query', {status, sessionKey},1).then(res => {
      console.log(res)
      this.setData({
        orderlist: res
      })
    })    
  },
  //订单状态切换
  choseorder: function (event) {
    const {value} = event.currentTarget.dataset
    this.setData({
      selectIndex: value
    })
   this.queryOrder(value)
  },
});