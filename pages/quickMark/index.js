const app = getApp();
// pages/quickMark/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    userInfo: null,
    hasUserInfo: true,
    userNick: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      hidden: false,
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      userNick: e.detail.userInfo.nickName
    });

    // this.click();
  },
  click: function () {
    var _this = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: resSetting => {
              app.globalData.userInfo = resSetting.userInfo;
              _this.setData({
                userInfo: resSetting.userInfo,
                hasUserInfo: true,
                userNick: resSetting.userInfo.nickName
              });
            }
          });
          wx.scanCode({
            success: (res) => {
              app.globalData.url = res.result
              wx.switchTab({
                url: '../goods/index',
              })
            }
          })
        } else {
          _this.setData({
            hidden: true,
            hasUserInfo: true
          });
        }
      }
    });
  
   
  },


})