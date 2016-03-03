var config = require('../config.json');
var logger = require('log4js').getLogger('routers/index.js');

var async = require('async');
var express = require('express');
var router = express.Router();
var goods_dao = require('../dao/goods_dao');
var news_dao = require('../dao/news_dao');

router.get('/', function(req, res, next) {
  var base_voucher_act_status_notStart = config.base_voucher_act_status_notStart;
  var base_voucher_act_status_going = config.base_voucher_act_status_going;
  var activityStatus = config.base_voucher_act_status_going;
  var frontstageShowFlag = 1;
  var deleteFlag = 1;
  var companyId = 4;
  var mobileFlag = 1;
  var newsType = 2;
  
  async.parallel({
    newslistData : function(callback){
      news_dao.homePageNewslist(companyId, deleteFlag, newsType, frontstageShowFlag, function(err, newslist) {
        callback(err, newslist);
      });
    },
    carouselPicList1Data : function(callback){
      var homepageLayoutAreaFlag = 1;
      goods_dao.homePageCarouselPic(base_voucher_act_status_notStart, base_voucher_act_status_going, activityStatus, homepageLayoutAreaFlag, 
          frontstageShowFlag, deleteFlag, companyId, mobileFlag, function(err, carouselPicList1) {
        callback(err, carouselPicList1);
      });
    },
    carouselPicList2Data : function(callback){
      var homepageLayoutAreaFlag = 2;
      goods_dao.homePageCarouselPic(base_voucher_act_status_notStart, base_voucher_act_status_going, activityStatus, homepageLayoutAreaFlag, 
          frontstageShowFlag, deleteFlag, companyId, mobileFlag, function(err, carouselPicList1) {
        callback(err, carouselPicList1);
      });
    }
  },

  function(err, results) {
    //准备数据
    var newslist = results.newslistData;
    var carouselPicList1 = results.carouselPicList1Data;
    var carouselPicList2 = results.carouselPicList2Data;

    res.render('index', {
      layout : 'layout',
      title : '首页',
      newslist : newslist,
      carouselPicList1 : carouselPicList1,
      carouselPicList2 : carouselPicList2
    });
  });
});

module.exports = router;
