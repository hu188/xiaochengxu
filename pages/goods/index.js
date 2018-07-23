//获取应用实例
const app = getApp();
import common from '/utils/common';
import { http } from '../../utils/http'
Page({
    ...common,
    data: {
        types: [],
        list: []
    },
    onLoad(e) {
        const { type } = getApp().globalData
        http('goods/typeList', type, 1).then(res => {
            if (res.length > 0) {
                const { id } = res[0]
                this.queryChild(id)
            }
            this.setData({
                types: res
            })
        })
    },
    typeHand(e) {
        const { id } = e.currentTarget.dataset
        this.queryChild(id)
    },
    queryChild(id) {
        const { type } = getApp().globalData
        const param = {
            CommodityType: id,
            type: type.type,
            level: type.level
        }
        http('goods/list', param, 1).then(res => {
            this.setData({
                list: res
            })
        })
    },
    //搜索功能
    showSearch: function (ev) {
        var hides = this.data.hideClass == "hideClass" ? "" : "hideClass";
        var shows = this.data.showClass == "showClass" ? "" : "showClass";
        var showCancel = this.data.showCancel == "showCancel" ? "" : "showCancel";
        this.setData({
            hideClass: hides,
            showClass: shows,
            showCancel: showCancel
        });
    },

    closeCancel: function (ev) {
        var hides = this.data.hideClass == "hideClass" ? "" : "hideClass";
        var shows = this.data.showClass == "showClass" ? "" : "showClass";
        var showCancel = this.data.showCancel == "showCancel" ? "" : "showCancel";
        this.setData({
            hideClass: hides,
            showClass: shows,
            showCancel: showCancel
        });
    },

    btn: function (ev) {
        var that = this;
        var search_con = ev.detail.value;
        if (search_con == '') {
            my.showToast({
                type: 'exception',
                content: '请输入搜索内容',
                duration: 3000,
            });
            return;
        }
        my.navigateTo({
            url: '../goods/goodslist?search_con=' + search_con
        });
    },

    //点击三级分类跳转商品列表
    getGoodsBySort: function (event) {
        const { dataset } = event.currentTarget
        const { id } = dataset
        if (id != '') {
            my.navigateTo({
                url: '../goodsDetail/index?id=' + id
            });
        }
    },
    // onShareAppMessage() {
    //     var that = this;
    //     return {
    //         title: '为您分' + app.globalData.projecttitle + '小程序',
    //         path: 'pages/goods/goodsdetails?id=' + that.data.id,
    //         success: function (res) {
    //             console.log(that.data.id);
    //             // 转发成功
    //         },
    //         fail: function (res) {
    //             // console.log('fail');
    //             // 转发失败
    //         }
    //     }
    // },
})