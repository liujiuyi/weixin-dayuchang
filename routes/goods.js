var config = require('../config.json');
var logger = require('log4js').getLogger('routers/goods.js');

var async = require('async');
var express = require('express');
var router = express.Router();
var goods_dao = require('../dao/goods_dao');

router.get('/goods_detail', function (req, res, next) {
  logger.info(req.query);
  var goodsId = req.query.goodsId;
  var deleteFlag = 1;
  var auditStatusPass = 2;
  var activationFlagYes = 1;
  var statusNo = 2;
  
  var goodsStatus = 1;
  var goodsOnsaleStatus = 2;
  var auditStatus = 2;
  var companyId = 4;
  var baseSoTypeService = config.base_so_type_service;
  var refundFlag = 1;
  var showFlag = 1;
  
  async.parallel({
    goodsPictureurListData : function(callback){
      goods_dao.queryGoodsPicture(goodsId, function(err, goodsPictureurList) {
        callback(err, goodsPictureurList);
      });
    },
    goodsDetailData : function(callback){
      goods_dao.queryGoodsDetails(goodsId, goodsStatus, goodsOnsaleStatus, auditStatus, companyId, deleteFlag, baseSoTypeService, refundFlag, showFlag, function(err, goodsDetail) {
        callback(err, goodsDetail);
      });
    }
  },

  function(err, results) {
    //准备数据
    var goodsPictureurList = results.goodsPictureurListData;
    var goodsDetail = results.goodsDetailData;

    res.render('goods_detail', {
      layout : 'layout',
      title : '商品详情',
      goodsPictureurList : goodsPictureurList,
      goodsDetail : goodsDetail[0]
    });
  });
});

router.get('/goods_list', function (req, res, next) {
  res.render('goods_list');
});

module.exports = router;
