"use strict";
var config = require('../config.json');
var logger = require('log4js').getLogger('dao/goods_dao.js');

var mysql = require('mysql');

var GoodsDao = function() {
  this.mainPool = mysql.createPool(config.mysql);
};

GoodsDao.prototype = {
  homePageCarouselPic : function (base_voucher_act_status_notStart, base_voucher_act_status_going, activityStatus, homepageLayoutAreaFlag, 
      frontstageShowFlag, deleteFlag, companyId, mobileFlag, callback) {
      var sql = 'SELECT ' +  
                '   CAROUSEL_PIC.HOMEPAGE_CAROUSEL_PIC_ID homepageCarouselPicId, ' +  
                '   CAROUSEL_PIC.GOODS_PIC_SHOW_ORDER goodsPicShowOrder, ' +  
                '   CAROUSEL_PIC.GOODS_PIC_NAME goodsPicName, ' +  
                '   CAROUSEL_PIC.GOODS_PIC_URL goodsPicUrl, ' +  
                '   CAROUSEL_PIC.GOODS_TYPE goodsType, ' +  
                '   CAROUSEL_PIC.GOODS_ID goodsId, ' +  
                '   CAROUSEL_PIC.CATEGORY_ID categoryId, ' +  
                '   CAROUSEL_PIC.DISCOUNT_ACTIVITY_ID  discountActivityId, ' +  
                '   CAROUSEL_PIC.VOUCHER_ACT_ID voucherActId, ' +  
                '   CAROUSEL_PIC.GIFTBOX_ID giftboxId, ' +  
                '   CAROUSEL_PIC.FULLOFF_ID fulloffId, ' +  
                '   GOODS.GOODS_FLAG goodsFlag ' +  
                'FROM ' +  
                '   F_HOMEPAGE_CAROUSEL_PIC_T CAROUSEL_PIC ' +  
                'LEFT JOIN  ' +  
                '   F_HOMEPAGE_LAYOUT_CONFIG_T LAYOUT_CONFIG ' +  
                'ON ' +  
                '   LAYOUT_CONFIG.HOMEPAGE_LAYOUT_CONFIG_ID = CAROUSEL_PIC.HOMEPAGE_LAYOUT_CONFIG_ID ' +  
                'LEFT JOIN ' +   
                '   G_GOODS_T GOODS ' +  
                'ON ' +   
                '   GOODS.GOODS_ID = CAROUSEL_PIC.GOODS_ID ' +  
                'LEFT JOIN ' +   
                '   G_VOUCHER_ACT_T VOUCHER_ACT ' +  
                'ON ' +   
                '   VOUCHER_ACT.VOUCHER_ACT_ID = CAROUSEL_PIC.VOUCHER_ACT_ID ' +  
                'AND ' +   
                '   VOUCHER_ACT.VOUCHER_ACT_STATUS IN (?,?) ' +  
                'AND ' +   
                '   VOUCHER_ACT.ALLOW_GET_END_DATE <= NOW() ' +  
                'LEFT JOIN ' +   
                '   G_GIFTBOX_T GIFTBOX ' +  
                'ON ' +   
                '   GIFTBOX.GIFTBOX_ID = CAROUSEL_PIC.GIFTBOX_ID ' +  
                'AND ' +  
                '   GIFTBOX.ACTIVITY_STATUS = ? ' +   
                'WHERE ' +   
                '   LAYOUT_CONFIG.HOMEPAGE_LAYOUT_AREA_FLAG = ? ' +  
                'AND ' +  
                '   CAROUSEL_PIC.FRONTSTAGE_SHOW_FLAG = ? ' +  
                'AND ' +  
                '   LAYOUT_CONFIG.DELETE_FLAG = ? ' +  
                'AND ' +  
                '   (NOW() BETWEEN IFNULL(DATE(CAROUSEL_PIC.FRONTSTAGE_SHOW_START_DATE), NOW()) ' +   
                'AND ' +  
                '   IFNULL(DATE(CAROUSEL_PIC.FRONTSTAGE_SHOW_END_DATE), NOW())) ' +   
                'AND ' +  
                '   LAYOUT_CONFIG.COMPANY_ID = ? ' +  
                'AND ' +  
                '   CAROUSEL_PIC.GOODS_PIC_URL is not null ' +  
                'AND ' +  
                '   LAYOUT_CONFIG.MOBILE_FLAG = ? ' +   
                'ORDER BY ' +   
                '   CAROUSEL_PIC.GOODS_PIC_SHOW_ORDER' ;
    
    var args = [ base_voucher_act_status_notStart, base_voucher_act_status_going, activityStatus, homepageLayoutAreaFlag, 
                 frontstageShowFlag, deleteFlag, companyId, mobileFlag ];
    this.mainPool.query(sql, args, function(err, results){
      if (err) logger.error(err);
      callback(err, results);
    });
    logger.debug('[sql:]%s, %s', sql, JSON.stringify(args));
  },
  
  queryGoodsPicture : function (goodsId, callback) {
      var sql = 'SELECT ' +  
                '   GOODS_PICTURE.GOODS_PICTURE_URL ZPictureUrl, ' +  
                '   REVERSE( CONCAT(SUBSTR(REVERSE ( GOODS_PICTURE.GOODS_PICTURE_URL),1,INSTR(REVERSE (GOODS_PICTURE.GOODS_PICTURE_URL),\'/\')-2), ' +  
                '       SUBSTR(REVERSE ( GOODS_PICTURE.GOODS_PICTURE_URL),INSTR(REVERSE (GOODS_PICTURE.GOODS_PICTURE_URL),\'/\')) ' +  
                '   )) pictureUrl ' +  
                'FROM ' +  
                '   G_GOODS_PICTURE_T GOODS_PICTURE ' +  
                'WHERE ' +   
                '   GOODS_PICTURE.GOODS_ID = ? ' +  
                'ORDER BY GOODS_PICTURE.PIC_ORDER ASC, GOODS_PICTURE.GOODS_PICTURE_ID';
    
    var args = [ goodsId ];
    this.mainPool.query(sql, args, function(err, results){
      if (err) logger.error(err);
      callback(err, results);
    });
    logger.debug('[sql:]%s, %s', sql, JSON.stringify(args));
  },
  
  queryGoodsDetails : function (goodsId, goodsStatus, goodsOnsaleStatus, auditStatus, companyId, deleteFlag, baseSoTypeService, refundFlag, showFlag, callback) {
      var sql = 'SELECT  ' +  
                '   GOODS.GOODS_ID goodsId, ' +  
                '   GOODS.GOODS_FLAG goodsFlag, ' +  
                '   GOODS.CATEGORY_ID categoryId, ' +  
                '   CATEGORY.CATEGORY_NAME categoryName, ' +  
                '   GOODS.GOODS_NAME goodsName, ' +  
                '   GOODS.BRAND_ID brandId, ' +  
                '   BRAND.BRAND_NAME brandName, ' +  
                '   GOODS.GOODS_INTRODUCTION goodsIntroduction, ' +
                '   GOODS.PURCHASE_MIN purchaseMin, ' +            
                '   GOODS.PURCHASE_MAX purchaseMax, ' +            
                '   GOODS.FREE_POSTAGE freePostage, ' +            
                '   GOODS.PURCHASE_TIMES purchaseTimes, ' +        
                '   GOODS.GOODS_TYPE goodsType, ' +                
                '   GOODS.GOODS_CODE goodsCode, ' +                
                '   GOODS.FRONT_DESCRIPTION_PC frontDescriptionPc, ' + 
                '   FUNC_GET_LEVEL1_CATEGORY (GOODS.CATEGORY_ID) categoryIdLevel1, ' + 
                '   (group_concat(concat("满",format(FULLOFF_BY_AMOUNT.FULL_AMOUNT,2),"减",format(FULLOFF_BY_AMOUNT.OFF_AMOUNT,2)))) fullRules,  ' +
                '       GOODS.REFUND_FLAG refundFlag, ' +                                 
                '       (SELECT COUNT(1) ' +   
                '          FROM B_GOODS_EVALUATE_T GOODSEVALUATET ' +  
                '         WHERE GOODSEVALUATET.GOODS_ID = GOODS.GOODS_ID ' +  
                '   ) evaluateNum, ' +  
                '   (SELECT IFNULL(TRUNCATE(AVG(GOODS_EVALUATE.GOODS_SCORE), 1),0) FROM B_GOODS_EVALUATE_T GOODS_EVALUATE WHERE GOODS_EVALUATE.GOODS_ID = GOODS.GOODS_ID AND GOODS_EVALUATE.SHOW_FLAG = ? ) goodsScore, ' +  
                '   IF( GOODS.GOODS_TYPE = ? AND GOODS.REFUND_FLAG = ?,(SELECT REFUND_DATE_LIMIT FROM O_SO_CONFIG_T SOCONFIG WHERE SOCONFIG.COMPANY_ID = GOODS.COMPANY_ID),NULL) refundDateLimit ' +  
                'FROM G_GOODS_T GOODS ' +  
                'LEFT JOIN G_BRAND_T BRAND ' +  
                '  ON ' +  
                '    GOODS.BRAND_ID = BRAND.BRAND_ID ' +  
                'LEFT JOIN G_CATEGORY_T CATEGORY ' +  
                '  ON ' +  
                '    CATEGORY.CATEGORY_ID = GOODS.CATEGORY_ID ' +  
                'LEFT JOIN G_FULLOFF_BY_AMOUNT_T FULLOFF_BY_AMOUNT ' +  
                ' ON ' +  
                '   FULLOFF_BY_AMOUNT.FULLOFF_ID = FUNC_GET_FULLOFF_ID(GOODS.GOODS_ID,?) ' +  
                'WHERE GOODS.GOODS_STATUS = ? ' +  
                '  AND ' +  
                '     GOODS.GOODS_ON_SALE_STATUS = ? ' +  
                '  AND ' +  
                '     GOODS.AUDIT_STATUS = ? ' +  
                '  AND ' +  
                '     GOODS.COMPANY_ID = ? ' +   
                '  AND ' +  
                '     GOODS.DELETE_FLAG = ? ' +  
                '  AND ' +  
                '     GOODS.GOODS_ID = ?';
    
    var args = [ showFlag, baseSoTypeService, refundFlag, companyId, goodsStatus, goodsOnsaleStatus, auditStatus, companyId, deleteFlag, goodsId ];
    this.mainPool.query(sql, args, function(err, results){
      if (err) logger.error(err);
      callback(err, results);
    });
    logger.debug('[sql:]%s, %s', sql, JSON.stringify(args));
  },
  
  queryGoodsMessage : function (deleteFlag, auditStatusPass, activationFlagYes, statusNo, goodsId, callback) {
      var sql = 'SELECT ' +  
                '   GOODS.DELETE_FLAG deleteFlag, ' +  
                '   GOODS.GOODS_ON_SALE_STATUS goodsOnSaleStatus, ' +  
                '   GOODS.GOODS_NAME goodsName ' +  
                'FROM ' +  
                '   G_GOODS_T GOODS  ' +  
                'WHERE ' +   
                '   GOODS.DELETE_FLAG = ? ' +  
                'AND ' +  
                '   GOODS.AUDIT_STATUS = ? ' +  
                'AND ' +  
                '   GOODS.GOODS_STATUS = ? ' +  
                'AND ' +  
                '   GOODS.GOODS_ON_SALE_STATUS = ? ' +   
                'AND ' +  
                '   GOODS.GOODS_ID = ? ';
    
    var args = [ deleteFlag, auditStatusPass, activationFlagYes, statusNo, goodsId ];
    this.mainPool.query(sql, args, function(err, results){
      if (err) logger.error(err);
      callback(err, results);
    });
    logger.debug('[sql:]%s, %s', sql, JSON.stringify(args));
  }
};
module.exports = new GoodsDao();
