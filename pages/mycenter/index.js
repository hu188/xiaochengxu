const app = getApp();
import util from '../../utils/util';
Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
    wx.hideTabBar()
    wx.getUserInfo({
      success: res =>{
        const { userInfo} = res
        this.setData({
          userInfo
        })
      }
    })
  },
  onShow: function () {
  }
});
