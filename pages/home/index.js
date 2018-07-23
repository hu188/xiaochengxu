import { http } from '../../utils/http'
const app = getApp();
import util from '/utils/util';
Page({
  ...util,
  data: {
    lat: 0,
    lng: 0,
    markers: [{
      iconPath: "/images/gou.png",
      id: 10,
      latitude: 30.273923,
      longitude: 120.12703,
    }],
    includePoints: [
      {
        latitude: 30.273923,
        longitude: 120.12703,
      }
    ],
    deviceList: []
  },
  onLoad(options) {
    this.getLocation();
  },
  //获取当前位置坐标
  getLocation: function (e) {
    var that = this;
    my.getLocation({
      type: 2,
      success(res) {
        my.hideLoading();
        //定位到的当前地址名称,并将地址存入到缓存中
        var selectUserAddr = res.province + res.city + res.district + res.streetNumber['street'] + res.streetNumber['number'];
        //var selectUserAddr = res.province + res.city + res.district;
        my.setStorageSync({ key: 'selectUserAddr', data: selectUserAddr });

        var gg_lng = res.longitude;
        var gg_lat = res.latitude;
        //高德坐标转百度坐标
        var X_PI = Math.PI * 3000.0 / 180.0;
        var x = gg_lng, y = gg_lat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;

        my.setStorageSync({ key: 'posLat', data: bd_lat });
        my.setStorageSync({ key: 'posLng', data: bd_lng });
        my.setStorageSync({ key: 'selectLat', data: bd_lat });
        my.setStorageSync({ key: 'selectLng', data: bd_lng });
        that.showNearbyShebei();
        that.setData({
          selectUserAddr: selectUserAddr,
          lat: bd_lat,
          lng: bd_lng
        });
      },
      fail() {
        my.hideLoading();
        my.alert({ title: '定位失败' });
      },
    })
  },

  //获取附近设备
  showNearbyShebei: function () {
    my.httpRequest({
      url: 'https://www.tianrenyun.com.cn/vendor/api/device/list',
      data: {
        "type": "2",
        "level": "2"
      },
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        const { data } = res.data
        let markers = []
        let points = []
        data.forEach(item => {
          markers.push({
            id: item.deviceId,
            latitude: item.lat,
            longitude: item.lng,
            width: 50,
            height: 50,
            title: item.deviceProperty
          })
          points.push(
            {
              latitude: item.lat,
              longitude: item.lng,
            }
          )
        })
        this.setData({
          deviceList: data,
          markers,
          includePoints: points
        });
      }
    })
  },

  //
  radioChange: function (e) {
    var that = this;
    var branch_str = e.detail.value;
    var branch_str = branch_str.split('|');
    var branch_idx = branch_str[0];
    var branch_guid = branch_str[1];
    var branch_code = branch_str[2];
    var branch_name = branch_str[3];
    var branch_address = branch_str[4];


    // wx.setStorageSync('branch_guid', branch_guid); //设置门店guid
    // wx.setStorageSync('branch_code', branch_code); //设置门店guid
    // wx.setStorageSync('branch_name', branch_name); //设置门店名
    // wx.setStorageSync('branch_address', branch_address); //设置门店地址

    my.setStorageSync({ key: 'branch_guid', data: branch_guid });
    my.setStorageSync({ key: 'branch_code', data: branch_code });
    my.setStorageSync({ key: 'branch_name', data: branch_name });
    my.setStorageSync({ key: 'branch_address', data: branch_address });

    var branchlist = that.data.BRANCHLIST;

    var newbranchlist = new Array();
    if (!util.isNull(branchlist)) {
      for (var v in branchlist) {
        if (my.getStorageSync({ key: 'branch_guid' }).data == branchlist[v]['GUID']) {
          branchlist[v]['checked'] = 1;
        } else {
          branchlist[v]['checked'] = 0;
        }
        var branch_v = branchlist[v];
        newbranchlist.push(branch_v);
      }
      that.setData({
        BRANCHLIST: newbranchlist
      });
    }

  },

  //测试获取商品分类
  goodslistcs: function () {
    my.httpRequest({
      url: 'https://www.tianrenyun.com.cn/vendor/api/goods/list', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      //data: post_data,
      data: {
        "CommodityType": "10",
        "type": "2",
        "level": "2"
      },
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        console.log('resss');
        console.log(res.data);
      }
    })
  },

  //测试获取商品优惠券信息
  goodscoupon: function () {
    my.httpRequest({
      url: 'http://www.tianrenyun.com.cn/vendor/api/coupon/goodsCoupon', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      //data: post_data,
      data: {
        "id": "168",
        "sessionKey": "53CD4E223DB1F91E"
      },
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        console.log('商品优惠信息');
        console.log(res.data);
      }
    })
  },

  //测试获取优惠券列表信息
  couponlist: function () {
    my.httpRequest({
      url: 'http://www.tianrenyun.com.cn/vendor/api/coupon/list',
      //data: post_data,
      data: {
        "sessionKey": "53CD4E223DB1F91E"
      },
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        console.log(res.data);
      }
    })
  },

  //获取设备位置
  GetshebeiLocation: function (e) {
    var longitude = e.currentTarget.dataset.lng;
    var latitude = e.currentTarget.dataset.lat;
    var name = e.currentTarget.dataset.deviceName;
    var address = e.currentTarget.dataset.deviceProperty;
    my.openLocation({
      longitude: '121.549697',
      latitude: '31.227250',
      name: '支付宝',
      address: '杨高路地铁站',
    });
  },
  tapHandler(e) {
    if (e * 1 === 2) {
      scancode()
    } else if (e * 1 === 3) {
      my.navigateTo({
        url: '../mycenter/index'
      })
    }
  }
})

function scancode() {
  const data = getApp().checkLogin()
  if (data === undefined) {
    getApp().login()
  }
  my.scan({
    type: '',
    success: (res) => {
      console.log(res.code)
      if (res.code.indexOf('/') > 0) {
        my.navigateTo({
          url: '../goods/index'
        })
      } else {
        my.navigateTo({
          url: '../goodsDetail/index?id=' + res.code
        })
      }
    },
    fail: (res) => {
    }
  });
}

//高德坐标转百度（传入经度、纬度）
function bd_encrypt(gg_lng, gg_lat) {
  var X_PI = Math.PI * 3000.0 / 180.0;
  var x = gg_lng, y = gg_lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return {
    bd_lat: bd_lat,
    bd_lng: bd_lng
  };

}
//百度坐标转高德（传入经度、纬度）
function bd_decrypt(bd_lng, bd_lat) {
  var X_PI = Math.PI * 3000.0 / 180.0;
  var x = bd_lng - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return { lng: gg_lng, lat: gg_lat }
}


