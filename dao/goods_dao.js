"use strict";
var config = require('../config.json');
var logger = require('log4js').getLogger('dao/account_dao.js');

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
  }
};
module.exports = new GoodsDao();
