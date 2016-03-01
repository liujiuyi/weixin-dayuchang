var logger = require('log4js').getLogger('routers/index.js');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
    layout : 'layout',
    title : '首页'
  });
});

module.exports = router;
