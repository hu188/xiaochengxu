//获取应用实例
const app = getApp();
import util from '/utils/util';
Page({
  ...util,
  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false,
    selected2: false
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
      selected1: true,
      selected2: false
    })
  },
  selected2: function (e) {
    this.setData({
      selected: false,
      selected1: false,
      selected2: true
    })
  },
  /*tab切换*/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    // var pages = getCurrentPages() //获取加载的页面
    // var currentPage = pages[pages.length - 1] //获取当前页面的对象
    // var url = currentPage.route //当前页面url
    // var options = currentPage.options //如果要获取url中所带的参数可以查看options
    // var url1 = url.replace('pages', '..');

    const that = this;
    //判断只有当未授权的时候，才调用app.js中的授权方法
    if (app.globalData.isGetedAuth == 0) {
      app.globalData.isCanceledAuth = 0;
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
              // console.log('touxiang' + app.globalData.userInfo.avatar);
              // console.log('nickName' + app.globalData.userInfo.nickName);
              my.showLoading({
                content: '用户信息获取中...',
              });

              //如果是来自会员卡那边，url为'card'，走毕凯那边的请求

              //console.log('进入了不是card操作');
              //获取用户user_id
              var post_data = {
                'QueryType': 'ali_getuserinfo_new',
                'UserGuid': app.globalData.UserGuid,
                'Params': '{"authcode":"' + res.authCode + '","orgguid":"88-shop"}'
              };
              // console.log('post_data:');
              // console.log(post_data);
              // 认证成功
              // 调用自己的服务端接口，让服务端进行后端的授权认证，并且种session，需要解决跨域问题
              my.httpRequest({
                url: app.globalData.hostname + '/quickProjectAPI', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
                data: post_data,
                method: 'POST',
                header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                success: (res) => {
                  // console.log('resss');
                  // console.log(res.data);

                  my.hideLoading();
                  var user_id = res.data;
                  app.globalData.alipay_user_id = user_id;
                  my.setStorageSync({
                    key: 'alipay_user_id',
                    data: user_id
                  });

                  app.globalData.getting_userinfo = 1;

                  my.showLoading({
                    content: '加载中...',
                  });
                  //如果是非登录版本或用会员卡登录版本，在此操作中创建用户
                  if (app.globalData.isNeedLogin == '0' || app.globalData.isNeedLogin == '2') {
                    //根据用户user_id请求已办卡用户的手机号，2018.2.7新增start
                    var post_data5 = {
                      'QueryType': 'get_alimember_phone1',
                      'UserGuid': app.globalData.UserGuid,
                      'Params': '{"user_id":"' + app.globalData.alipay_user_id + '","token":"' + app.globalData.token + '"}'
                    };
                    my.httpRequest({
                      url: app.globalData.hostname + '/quickProjectAPI',
                      data: post_data5,
                      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      header: { 'content-type': 'application/json' }, // 设置请求的 header
                      //  header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                      success: function (res) {
                        if (res.data != null) {
                          var memberphone = res.data.手机号;
                        } else {
                          var memberphone = '';
                        }

                        var from = 'alipay';
                        //用户是否存在，如果不存在，创建用户,如果存在，更新相应字段
                        var post_data = {
                          'QueryType': 'create_common_user',
                          'UserGuid': app.globalData.UserGuid,
                          'Params': '{"phone":"' + memberphone + '","username":"' + app.globalData.userInfo.nickName + '","alipay_user_id":"' + app.globalData.alipay_user_id + '","isNeedLogin":"' + app.globalData.isNeedLogin + '","from":"' + from + '","photo":"' + app.globalData.userInfo.avatar + '"}'
                        };
                        // console.log('post_data');
                        // console.log(post_data);
                        my.httpRequest({
                          url: app.globalData.hostname + '/quickProjectAPI',
                          data: post_data,
                          method: 'POST',
                          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                          success: function (r) {
                            // console.log('sssss');
                            // console.log(r.data);
                            //如果返回正确跳转到个人中心
                            if (r.data.rtn != "false") {
                              my.setStorageSync({ key: 'userphone', data: r.data.phone });
                              app.globalData.user_id = r.data.guid;
                              console.log('user_id');
                              console.log(app.globalData.user_id);

                            }

                            if (app.globalData.isNeedLogin == 0) {
                              //如果是非登录版本，直接获取购物车信息，不需要再处理登录操作
                              ajax_my_coupon(that);
                            } else if (app.globalData.isNeedLogin == 2) {
                              var userphone = my.getStorageSync({ key: 'userphone' }).data;
                              if (userphone == '') {
                                //如果手机号为空，跳转到登录
                                my.navigateTo({
                                  url: '/pages/card/index'
                                });
                                return;
                              } else {
                                ajax_my_coupon(that);
                              }
                            }
                          },
                          fail: function () { }
                        });
                      }
                    });
                    //根据用户user_id请求已办卡用户的手机号，2018.2.7新增end
                  } else if (app.globalData.isNeedLogin == 1) {
                    //如果为登录版本，需要判断用户是否登录，未登录则跳转登录页面
                    var userphone = my.getStorageSync({ key: 'userphone' }).data;
                    if (userphone == '') {
                      //如果手机号为空，跳转到登录
                      my.navigateTo({
                        url: '/pages/userlogin/userlogin'
                      });
                      return;
                    } else {
                      ajax_my_coupon(that);
                    }
                  }
                },
                fail: (res) => {
                  // 根据自己的业务场景来进行错误处理
                },
              });
            },//my.getAuthUserInfo end,获取用户基本信息，昵称和头像结束
            fail: (res1) => {
              //console.log('get auth code:' + res1)
            }
          });
        },
        fail: (res) => {
          app.globalData.isCanceledAuth = 1;
          my.showToast({
            content: 'fail',
            content: '您拒绝了授权，将无法正常使用商城功能',
            success: function (res) {
              if (res.confirm) {
              } else {

              }
              that.setData({
                coupon_new: new Array(),
                coupon_lose: new Array(),
                coupon_used: new Array()
              });
            }
          });
        }
      });
      return;
    } else {
      my.showLoading({
        content: '加载中...',
      });
      ajax_my_coupon(that);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});

function ajax_my_coupon(that) {
  if (!app.globalData.user_id) {
    return;
  }
  /*请求获取个人优惠券start*/
  var post_data = {
    'QueryType': 'my_coupon',
    'UserGuid': app.globalData.UserGuid,
    'Params': '{"orgguid":"' + app.globalData.orgguid + '","openid":"' + app.globalData.user_id + '"}',
    'userguid': app.globalData.user_id
  };
  // console.log(post_data);
  my.httpRequest({
    url: app.globalData.hostname + '/quickProjectAPI',
    data: post_data,
    method: 'POST',
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    success: function (r) {
      // console.log('---------------------');
      // console.log(r.data);
      // console.log('---------------------');
      my.hideLoading();
      that.setData({
        coupon_new: r.data.coupon_new,
        coupon_lose: r.data.coupon_lose,
        coupon_used: r.data.coupon_used
      });
    },
    fail: function () {
      my.hideLoading();
    }
  });

  /*请求获取个人优惠券end*/
}