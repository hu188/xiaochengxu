require('./config$');

function success() {
require('../..//app');
require('../../components/tabBar/index');
require('../../pages/youxian/index');
require('../../pages/order/submitorder');
require('../../pages/youxian/goodsdetails');
require('../../pages/youxian/coupon');
require('../../pages/youxian/goodssort');
require('../../pages/mycenter/mycenter');
require('../../pages/mycenter/coupon');
require('../../pages/mycenter/orderlist');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
