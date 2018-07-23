//获取应用实例
const app = getApp();
import common from '/utils/common';
Page({
    ...common,
    data: {
        goodssortselected: '',
        goodssortlist: new Array()
    },

    changeIndicatorDots(e) {
        this.setData({
            indicatorDots: !this.data.indicatorDots
        })
    },
    changeAutoplay(e) {

        this.setData({
            autoplay: !this.data.autoplay
        })
    },
    intervalChange(e) {
        this.setData({
            interval: e.detail.value
        })
    },
    durationChange(e) {
        this.setData({
            duration: e.detail.value
        })
    },
    onLoad(e) {
        // console.log(e);
        var that = this;
        // my.showLoading({
        //     content: '加载中...',
        // });
        //请求获取商品分类信息
        my.httpRequest({
            url: 'https://www.tianrenyun.com.cn/vendor/api/goods/typeList', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
            data: {
                "type": "2",
                "level": "2"
            },
            method: 'POST',
            header: { 'Content-Type': 'application/x-www-form-urlencoded' },
            success: function (r) {
                var rdata = r.data.data;
                var first_classes = rdata;
                var goodssortlist = new Array();
                /**一级分类 */
                for (var v in first_classes) {
                    var goods_sort_v = first_classes[v];
                    console.log(goods_sort_v);
                    if (that.data.goodssortselected == '') {
                        that.data.goodssortselected = goods_sort_v.id;
                    }
                    var sort_v = {
                        'guid': goods_sort_v.id, 'name': goods_sort_v.commodityTypeName,
                        'img': 'http://romens-10034140.image.myqcloud.com/WS-1482021885084445.jpg'
                    };
                    goodssortlist.push(sort_v);
                }
                console.log(87878);
                console.log(goodssortlist);
                console.log(goodssortlist[0]['guid']);
                console.log(goodssortlist[0].guid);
                /**一级分类 */

                /**分类下的商品 */
                my.httpRequest({
                    url: 'https://www.tianrenyun.com.cn/vendor/api/goods/list', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
                    data: {
                        "CommodityType": goodssortlist[0]['guid'],
                        "type": "2",
                        "level": "2"
                    },
                    method: 'POST',
                    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    success: (res) => {
                        console.log('resss');
                        console.log(res.data);
                        var classes_list = res.data.data;

                        /**商品分类列表 */
                        var secondgoodssortlist = new Array();
                        //if (classes_list.length > 0) {
                        var classes_list = classes_list;
                        for (var v in classes_list) {
                            var goods_sort_v = classes_list[v];
                            var goods_img = app.globalData.hostname + '/theme/default/images/wap/search-none.png';
                            var sort_v = {
                                'guid': goods_sort_v.id,
                                'name': goods_sort_v.commodityName,
                                'price': goods_sort_v.costPrice,
                                'img': (goods_sort_v.MKSORTLOGO == null || goods_sort_v.MKSORTLOGO == '') ? goods_img : (goods_sort_v.HOST_NAME + goods_sort_v.MKSORTLOGO + goods_sort_v.PICEXTENSIONS)
                            };
                            secondgoodssortlist.push(sort_v);
                        }

                        that.setData({
                            secondgoodssortlist: secondgoodssortlist,
                        });

                        //}
                        /**商品分类列表 */
                    }

                })


                /**分类下的商品 */

                that.setData({
                    goodssortselected: that.data.goodssortselected,
                    goodssortlist: goodssortlist,
                    // secondgoodssortlist: secondgoodssortlist,
                });
                my.hideLoading();

            },
            fail: function () {
                my.hideLoading();
            }
        });

    },
    onShow(e) {
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
            url: '../goods/goodslist?search_con=' + search_con,
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
    },


    //点击三级分类跳转商品列表
    getGoodsBySort: function (event) {
        const {dataset} = event.currentTarget
        const {id} = dataset
        var that = this;
        if (id != '') {
            my.navigateTo({
                url: '../youxian/goodsdetails?id=' + id,
                success: function (res) {
                    // success
                },
                fail: function () {
                    my.hideToast();
                    // fail
                },
                complete: function () {
                    my.hideToast();
                    // complete
                }
            });
        }
    },
    //点击左侧分类列表加载右侧商品信息信息
    getGoodsSorts: function (event) {
        var that = this;
        if (event.currentTarget.id != '') {
            var goods_sort_v = that.data.goodssortselected = event.currentTarget.id;

            my.httpRequest({
                url: 'https://www.tianrenyun.com.cn/vendor/api/goods/list', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
                data: {
                    "CommodityType": goods_sort_v,
                    "type": "2",
                    "level": "2"
                },
                method: 'POST',
                header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                success: (res) => {
                    console.log('resss');
                    console.log(res.data);
                    var classes_list = res.data.data;


                    /**商品分类列表 */
                    var secondgoodssortlist = new Array();
                    //if (classes_list.length > 0) {
                    var classes_list = classes_list;
                    for (var v in classes_list) {
                        var goods_sort_v = classes_list[v];
                        var goods_img = app.globalData.hostname + '/theme/default/images/wap/search-none.png';
                        var sort_v = {
                            'guid': goods_sort_v.id, 
                            'name': goods_sort_v.commodityName,
                            'price': goods_sort_v.costPrice,
                            'img': (goods_sort_v.MKSORTLOGO == null || goods_sort_v.MKSORTLOGO == '') ? goods_img : (goods_sort_v.HOST_NAME + goods_sort_v.MKSORTLOGO + goods_sort_v.PICEXTENSIONS)
                        };

                        secondgoodssortlist.push(sort_v);
                    }

                    console.log(secondgoodssortlist);
                    that.setData({
                        goodssortselected: that.data.goodssortselected,
                        secondgoodssortlist: secondgoodssortlist,
                    });

                    //}
                    /**商品分类列表 */
                }
            })

        }
    },
    onShareAppMessage() {
        var that = this;
        return {
            title: '为您分' + app.globalData.projecttitle + '小程序',
            path: 'pages/goods/goodsdetails?id=' + that.data.id,
            success: function (res) {
                console.log(that.data.id);
                // 转发成功
            },
            fail: function (res) {
                // console.log('fail');
                // 转发失败
            }
        }
    },
})