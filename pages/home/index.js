import { http } from '../../utils/http'
const app = getApp();
let QQmap = require('../../utils/qqmap-wx-jssdk.min.js')
import util from '../../utils/util';
const {
  $Toast
} = require('../../components/base/index');
Page({
  data: {
    lat: 31.51296,
    lng: 120.294233,
    map: {},
    markers: [],
    includePoints: [],
    deviceList: [],
    address: {},
    auth: false,
    point:{},
  },
  onLoad(options) {
    this.setData({
      auth: app.globalData.auth
    })
    let map = new QQmap({
      key: 'VMDBZ-H7O3W-UMIRM-R5DNU-TK2J5-AGFJ5'
    });
    this.getLocation(map);
  },
  //获取当前位置坐标
  getLocation: function (map) {
    var that = this;
    wx.getLocation({

      
      type: 'wgs84',
      altitude: true,
      success: res => {
        const { latitude, longitude } = res //纬度经度
        map.reverseGeocoder({
          location: { latitude, longitude }, coord_type: 1, success: res => {
            const { result } = res
            const { address } = result
            const point = {
              latitude, longitude
            }
            this.setData({ address, point})
            this.showNearbyShebei()
          }, fail: err => {
            console.log(err)
          }
        })
      },
      fail() {
        wx.hideLoading();
        wx.alert({ title: '定位失败' });
      },
    })
  },

  //获取附近设备
  showNearbyShebei: function () {
    http('qsq/service/external/device/list', app.globalData.type, 1).then(res => {
      let markers = []
      let points = []
      res.forEach(item => {
        markers.push({
          id: item.deviceId,
          latitude: item.lat * 1,
          longitude: item.lng * 1,
          width: 50,
          height: 50,
          title: item.deviceProperty
        })
        points.push(
          {
            latitude: item.lat * 1,
            longitude: item.lng * 1,
          }
        )
      })
      this.setData({
        deviceList: res,
        markers,
        includePoints: points,
        showMap: true
      });
    })
  },

  handleChange(e) {
    const { key } = e.detail
    if (key === 'homepage') {

    } else if (key === 'mine') {
      wx.navigateTo({
        url: '../mycenter/index'
      })
    } else {
      scancode()
    }
  },

  getUserInfoFun(e) {
    const { errMsg } = e.detail
    if (errMsg === 'getUserInfo:ok') {
      this.setData({
        auth: true
      })
      app.login()
    }
  }
})

function scancode() {
  const data = getApp().checkLogin()
  if (data === '') {
    getApp().login()
  }
  wx.scanCode({
    success: (res) => {
      const { result } = res
      if (result.length > 0) {
        const str = result.split(':')[2]
        if (str === undefined){
          $Toast({
            content: '扫码失败',
            type: 'error'
          });
        } else {
          if (str.indexOf('//') === -1) {
            wx.navigateTo({
              url: '../goods/index'
            })
          } else {
            const id = str.split('=')[1].replace('//', '')
            wx.navigateTo({
              url: `../goodsDetail/index?id=${id}`
            })
          }
        }
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


