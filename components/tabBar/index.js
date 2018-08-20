// components/tabbar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   current:{
     type: String,
     value:'homepage'
   }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChange (e) {
      const {key} = e.detail
      if (key ==='order') {
        wx.switchTab({
          url: '/pages/order/index',
        })
      } else if (key ==='mine'){
        wx.switchTab({
          url: '/pages/mycenter/index',
        })
      } else {
        wx.switchTab({
          url: '/pages/goods/index',
        })
      }
      
    }
  }
})
