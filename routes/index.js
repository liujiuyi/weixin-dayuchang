var config = require('../config.json');
var logger = require('log4js').getLogger('routers/index.js');

var express = require('express');
var router = express.Router();
var goods_dao = require('../dao/goods_dao');

router.get('/', function(req, res, next) {
  var base_voucher_act_status_notStart = config.base_voucher_act_status_notStart;
  var base_voucher_act_status_going = config.base_voucher_act_status_going;
  var activityStatus = config.base_voucher_act_status_going;
  var homepageLayoutAreaFlag = 1;
  var frontstageShowFlag = 1;
  var deleteFlag = 1;
  var companyId = 4;
  var mobileFlag = 1;
  
  goods_dao.homePageCarouselPic(base_voucher_act_status_notStart, base_voucher_act_status_going, activityStatus, homepageLayoutAreaFlag, 
      frontstageShowFlag, deleteFlag, companyId, mobileFlag, 
    function(err, carouselPicList1) {
      if (err) {
        next(err);
      } else {
        res.render('index', {
          layout : 'layout',
          title : '首页',
          carouselPicList1 : carouselPicList1
        });
      }
    }
  );
});

module.exports = router;
