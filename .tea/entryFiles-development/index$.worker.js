require('./config$');

function success() {
require('../..//app');
require('../../components/tabBar/index');
require('../../pages/home/index');
require('../../pages/submitOrder/index');
require('../../pages/goodsDetail/index');
require('../../pages/coupon/index');
require('../../pages/goods/index');
require('../../pages/mycenter/index');
require('../../pages/mycoupon/index');
require('../../pages/order/index');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
