//获取应用实例
const app = getApp();
//import common from '/utils/common';
import util from '/utils/util';
Page({
  //...common,
  ...util,
  data: {
    userInfo: {},
    healthInfo: {},
    dfk: 0,
    dfh: 0,
    dsh: 0,
    ywc: 0,
    show_authorization: 0
  },
  //事件处理函数
  bindViewTap: function () {
    my.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

    //判断只有当未授权的时候，才调用此授权方法，1为当前页面在底部导航中，在IDE中授权relaunch方法无效
    var that = this;
    if (app.globalData.isGetedAuth == 0) {

    } else {

      //判断是否已经登录
      if (!util.isNull(my.getStorageSync({ key: 'userphone' }).data)) {
        var loginurl = '';
        var isshowlogin = 0;//0是不显示登录
        var showtext = '手机号：' + my.getStorageSync({ key: 'userphone' }).data;
        if (app.globalData.isNeedLogin == 2) {
          var logouttxt = '';
        } else {
          var logouttxt = '(解绑)';
        }
      } else if (app.globalData.isNeedLogin != 0) {
        var isshowlogin = 1;//1是显示登录
        var showtext = '点击登录';
        if (app.globalData.isNeedLogin == 2) {
          var loginurl = '../card/index';
        } else {
          var loginurl = '../userlogin/userlogin';
        }

        var logouttxt = '';
      }

      that.setData({
        userInfo: app.globalData.userInfo,
        isshowlogin: isshowlogin,
        showtext: showtext,
        logouttxt: logouttxt,
        loginurl: loginurl,
      });
      ajax_userorder_num(that);
    }

    //调用应用实例的方法获取全局数据
    // if (app.globalData.userInfo == null) {
    //   //app.getUserInfo(); //获取用户配置信息
    //   my.getAuthCode({
    //     scopes: 'auth_user',
    //     success: (res) => {
    //       my.getAuthUserInfo({
    //         //获取用户基本信息，昵称和头像
    //         success: (userInfo) => {
    //           app.globalData.userInfo = userInfo;
    //           my.setStorage({
    //             key: 'userinfo',
    //             data: {
    //               avatar: app.globalData.userInfo.avatar,
    //               nickName: app.globalData.userInfo.nickName
    //             }
    //           });
    //           //typeof cb === 'function' && cb(this.globalData.userInfo);
    //         },
    //         fail: (res1) => {
    //           console.log('get auth code:' + res1)
    //         }
    //       });
    //     }
    //   });
    // }

    /*获取用户积分
    var post_data = {
      'QueryType': 'get_user_integral',
      'UserGuid': app.globalData.UserGuid,
      'Params': '{"guid":"' + app.globalData.user_id + '"}'
    };
    console.log('eeeeee');
    my.httpRequest({
      url: app.globalData.hostname + '/quickProjectAPI',
      data: post_data,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json'}, // 设置请求的 header
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res);
        that.setData({
          signinpoint: res.data == null ? 0 : res.data.SIGNINPOINT,
          consumptionpoint: res.data == null ? 0 : res.data.CONSUMPTIONPOINT
        });
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    });
*/
  },
  onShow: function () {
    if (app.globalData.isGetedAuth == 0) {
      app.globalData.isCanceledAuth = 0;
      const that = this;
      my.getAuthCode({
        scopes: 'auth_user',
        success: (res) => {
          my.getAuthUserInfo({
            //获取用户基本信息，昵称和头像
            success: (userInfo) => {
              app.globalData.isGetedAuth = 1;
              app.globalData.userInfo = userInfo;

              my.setStorage({
                key: 'userinfo',
                data: {
                  avatar: app.globalData.userInfo.avatar,
                  nickName: app.globalData.userInfo.nickName
                }
              });
              console.log('touxiang' + app.globalData.userInfo.avatar);
              console.log('nickName' + app.globalData.userInfo.nickName);
              that.setData({
                userInfo: app.globalData.userInfo,
              })
              //获取用户user_id

            },//my.getAuthUserInfo end,获取用户基本信息，昵称和头像结束
            fail: (res1) => {
              //console.log('get auth code:' + res1)
            }
          });
        },
        fail: (res) => {
          app.globalData.isCanceledAuth = 1;
          that.data.show_authorization = 1;
          my.showToast({
            content: 'fail',
            content: '您拒绝了授权，将无法正常使用商城功能',
            success: function (res) {
              // my.reLaunch({
              //   url: '../mycenter/mycenter'
              // })
              if (res.confirm) {
              } else {
              }
            }
          });
        }
      });
      return;
    }
    var that = this;
    //判断是否已经登录
    if (!util.isNull(my.getStorageSync({ key: 'userphone' }).data)) {
      var isshowlogin = 0;//0是不显示登录
      var showtext = '手机号：' + my.getStorageSync({ key: 'userphone' }).data;
      if (app.globalData.isNeedLogin == 2) {
        var logouttxt = '';
      } else {
        var logouttxt = '(解绑)';
      }
    } else if (app.globalData.isNeedLogin != 0) {
      var isshowlogin = 1;//1是显示登录
      var showtext = '点击登录';
      if (app.globalData.isNeedLogin == 2) {
        var loginurl = '../card/index';
      } else {
        var loginurl = '../userlogin/userlogin';
      }

      var logouttxt = '';
    }
    that.setData({
      userInfo: app.globalData.userInfo,
      isshowlogin: isshowlogin,
      showtext: showtext,
      logouttxt: logouttxt,
      loginurl: loginurl,
      is_from_internal: app.globalData.is_from_internal
    })
    if (app.globalData.user_id != '') {
      var post_data3 = {
        'QueryType': 'ajax_userorder_num',
        'UserGuid': app.globalData.UserGuid,
        'Params': '{"wxid":"' + app.globalData.user_id + '"}'
      };
      my.httpRequest({
        url: app.globalData.hostname + '/quickProjectAPI',
        data: post_data3,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //header: { 'content-type': 'application/json'}, // 设置请求的 header
        //  header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          console.log('res:');
          console.log(res.data);
          console.log(res.data[0].dfk);
          that.setData({
            dfk: res.data[0].dfk,
            dfh: res.data[0].dfh,
            dsh: res.data[0].dsh,
            ywc: res.data[0].ywc
          })

        },
        fail: function (res) {
          console.log(res.data);
          my.hideLoading();
          // fail
        },
        complete: function () {
          my.hideLoading();
          // complete
        }
      });
    } else {
      that.setData({
        dfk: 0,
        dfh: 0,
        dsh: 0,
        ywc: 0
      });
    }
  },
  scanCodeTap: function () {
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        console.log(res.path);
        if (res.path != '') {
          wx.redirectTo({
            url: '../../' + res.path,
            success: function (res) {
              // success
            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          });
        }
      }
    });
  },
  userexit: function () {
    var that = this;
    my.confirm({
      title: '温馨提示',
      content: '确认退出吗？',
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      success: (result) => {
        var isshowlogin = 1;//1是显示登录
        var showtext = '点击登录';
        my.setStorageSync({ key: 'userphone', data: '' });
        if (app.globalData.isNeedLogin == 2) {
          var loginurl = '../card/index';
        } else {
          var loginurl = '../userlogin/userlogin';
        }
        that.setData({
          isshowlogin: isshowlogin,
          showtext: showtext,
          loginurl: loginurl
        });

      },
    });
  },
  tapHandler(e) {
    if (e * 1 === 2) {
      get_scancode()
    } else if (e * 1 === 3) {
      my.navigateTo({
        url: '../mycenter/mycenter'
      })
    } else {
      my.navigateTo({
        url: '../youxian/index'
      })
    }
  }
});

function ajax_userorder_num(that) {
  //获取用户的不同状态下的订单数量
  //支付宝二维码生成接口测试
  if (app.globalData.user_id != '') {
    var post_data3 = {
      'QueryType': 'ajax_userorder_num',
      'UserGuid': app.globalData.UserGuid,
      'Params': '{"wxid":"' + app.globalData.user_id + '"}'
    };
    my.httpRequest({
      url: app.globalData.hostname + '/quickProjectAPI',
      data: post_data3,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json'}, // 设置请求的 header
      //  header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log('res:');
        console.log(res.data);
        console.log(res.data[0].dfk);
        that.setData({
          dfk: res.data[0].dfk,
          dfh: res.data[0].dfh,
          dsh: res.data[0].dsh,
          ywc: res.data[0].ywc
        })

      },
      fail: function (res) {
        console.log(res.data);
        my.hideLoading();
        // fail
      },
      complete: function () {
        my.hideLoading();
        // complete
      }
    });
  } else {
    that.setData({
      dfk: 0,
      dfh: 0,
      dsh: 0,
      ywc: 0
    });
  }
}
