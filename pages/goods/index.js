//获取应用实例
const app = getApp();
import common from '/utils/common';
import { http } from '../../utils/http'
Page({
    ...common,
    data: {
        types: [],
        list: [],
        selectType: -1,
        count: 0,
        total: 0,
        selectGoods:[]
    },
    onLoad(e) {
        const { type } = getApp().globalData
        http('goods/typeList', type, 1).then(res => {
            if (res.length > 0) {
                const { id } = res[0]
                this.queryChild(id)
                this.setData({
                    types: res,
                    selectType: id
                })
            }
        })
    },
    typeHand(e) {
        const { id } = e.currentTarget.dataset
        this.queryChild(id)
        this.setData({
            selectType: id
        })
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
    queryDetail: function (event) {
        const { dataset } = event.currentTarget
        const { id } = dataset
        if (id != '') {
            my.navigateTo({
                url: '../goodsDetail/index?id=' + id
            });
        }
    },
    submitHandler() {
        const { total } = this.data
        if (total > 0) {
            getApp().globalData.goodsList = this.data.selectGoods
         my.navigateTo({
                url: '../submitOrder/index'
            });
        } else {
            my.showToast({
                content: '亲,请选择您中意的商品哦！'
            });
        }
    },
    async changeNumber(val) {
        let { list, count, total } = this.data
        const { value, index, type } = val
        let goods = list[index]
        if (type === 'plus') {
            count++
        } else {
            count--
        }
        goods['count'] = value
        if (goods.commodityCouponRelations.length > 0) {
            for (let i = 0; i < goods.commodityCouponRelations.length; i++) {
                const coupon = goods.commodityCouponRelations[i].coupon
                if (goods.count * goods.retailPrice >= coupon.minimum * 1) {
                    goods['coupons'] = coupon
                    break
                } else {
                    goods.coupon = {}
                }
            }
        } else {
           goods.coupon = {} 
        }
        const { coupons } = goods
        if (coupons && coupons.id) {
            const { couponType } = coupons
            if (couponType * 1 === 5) {
                goods['discount'] = goods.count * goods.retailPrice * coupons.discount * 0.01
            } else if (couponType * 1 === 6) {
                goods['discount'] = coupons.discount
            }
        } else {
            goods['discount'] = 0
        }
        list[index] = goods
        const selectGoods = list.filter(item => item.count && item.count > 0)
        let totalPrice = selectGoods.reduce((total, cur) => {
            return total + cur.count * cur.retailPrice - cur.discount
        }, 0)
        this.setData({
            list,
            count,
            total: totalPrice,
            selectGoods: selectGoods
        })
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