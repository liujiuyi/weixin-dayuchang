"use strict";
var config = require('../config.json');
var logger = require('log4js').getLogger('dao/news_dao.js');

var mysql = require('mysql');

var NewsDao = function() {
  this.mainPool = mysql.createPool(config.mysql);
};

NewsDao.prototype = {
  homePageNewslist : function (companyId, deleteFlag, newsType, frontstageShowFlag, callback) {
      var sql = 'SELECT ' +  
                '   NEWS.NEWS_ID newsId, ' +  
                '   NEWS.NEWS_TITLE newsTitle, ' +  
                '   NEWS.NEWS_TYPE newsType, ' +  
                '   NEWS.FRONTSTAGE_SHOW_FLAG frontstageShowFlag, ' +  
                '   NEWS.STICKY_POST_FLAG stickyPostFlag, ' +  
                '   NEWS.STICKY_POST_UNTIL_DATE stickyPostUntilDate, ' +  
                '   NEWS.UPDATE_DATE updateDate, ' +  
                '   NEWS.CREATE_DATE createDate, ' +  
                '   NEWS.VERSION version ' + 
                'FROM ' +  
                '   F_NEWS_T NEWS  ' +  
                'WHERE ' +   
                '   NEWS.COMPANY_ID = ? ' +  
                'AND ' +  
                '   NEWS.TERMINAL_FLAG = 2 ' +  
                'AND ' +  
                '    NEWS.DELETE_FLAG = ? ' +  
                'AND ' +  
                '   NEWS.NEWS_TYPE = ? ' +   
                'AND ' +  
                '   NEWS.FRONTSTAGE_SHOW_FLAG = ? ' +  
                'AND ' +  
                '   (NEWS.NEWS_TITLE IS NOT NULL) ' +  
                'AND ' +  
                '   DATE_FORMAT(NEWS.STICKY_POST_UNTIL_DATE,\'%Y-%m-%d\'  ) >= DATE_FORMAT(NOW(), \'%Y-%m-%d\') ' +   
                'ORDER BY ' +   
                '   NEWS.NEWS_ID ASC ' ;
    
    var args = [ companyId, deleteFlag, newsType, frontstageShowFlag ];
    this.mainPool.query(sql, args, function(err, results){
      if (err) logger.error(err);
      callback(err, results);
    });
    logger.debug('[sql:]%s, %s', sql, JSON.stringify(args));
  }
};
module.exports = new NewsDao();
