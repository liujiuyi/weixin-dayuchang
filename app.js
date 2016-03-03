"use strict";

var express = require('express');
var app = express();

var path = require('path');
var logger = require('log4js').getLogger('app.js');
var bodyParser = require('body-parser');

var hbs = require("hbs");
var config = require('./config.json');
var blocks = {};
hbs.registerHelper('extend', function(name, context) {
  var block = blocks[name];
  if (!block) {
    block = blocks[name] = [];
  }

  block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});
hbs.registerHelper('block', function(name) {
  var val = (blocks[name] || []).join('\n');

  // clear the block
  blocks[name] = [];
  return val;
});
hbs.registerHelper('pic', function(val) {
  return config.admin_project_url + val;
});
hbs.registerHelper('each_index_active', function(val) {
  if(val == 0)
    return "active";
  else 
    return "";
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(path.join(__dirname, 'bower_components')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function(req, res, next) {
  next();
});

var routes = require('./routes/index');
app.use('/', routes);

var goods_routes = require('./routes/goods');
app.use('/goods', goods_routes);


app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(function (err, req, res, next) {
  logger.error(err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message || err,
    error: {}
  });
});

module.exports = app;
