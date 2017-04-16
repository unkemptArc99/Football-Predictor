var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var http = require('http');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.configure('development', function(){
  app.set('address', 'localhost');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.get('/',function(req,res) {
  res.render('home',{
    title: 'Premier League Predictor'
  });
});

app.get('/', function(req, res){
  res.render('index', {
    address: app.settings.address,
    port: app.settings.port
});
});

if (!module.parent) {
  app.listen(app.settings.port);
  console.log("Server listening on port %d",
app.settings.port);
}

//for unserved browser files
app.use(express.static(__dirname + "/public"));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
