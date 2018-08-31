const BASE_URL = 'http://127.0.0.1:8080/api'
// const BASE_URL = 'https://www.tianrenyun.com.cn/vendor/api'
/**
 ** url:请求地址
  ** data:请求参数
   ** m:post/get 1:post
   ** h:headers 1:json
 */
module.exports =  {
    http:(url, data, m = 'GET', h)=> {
      wx.showLoading({
        title: '加载中...',
      })
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${BASE_URL}/${url}`, // 目标服务器url
                data: data,
                method: m ? 'POST' : 'GET',
                header: { 'content-type': h ? 'application/json' : 'application/x-www-form-urlencoded' },
                success: (res) => {
                    wx.hideLoading();
                    const { status, data } = res.data
                    if (status * 1 === 200) {
                        resolve(data)
                    } else if (status * 1 === 400) { //会话过期,重新登录
                        getApp().login()
                    } else {
                    }
                },
                fail: err=> {
                  console.log(err)
                    wx.hideLoading();
                }
            });
        })
    }
}