require('dotenv').config()
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var i18n = require("i18n");
require('./config/db')
var view = require('./routes/view');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(i18n.init);

i18n.configure({
	locales:['en','zn'],
	cookie: 'LocalLang',
	defaultLocale: 'en',
	extension: ".json",
	directory: __dirname + '/locales',
	logDebugFn: function (msg) {
			console.log('debug', msg);
	},
	logWarnFn: function (msg) {
			console.log('warn', msg);
	},
	logErrorFn: function (msg) {
			console.log('error', msg);
	}
});

app.use('/', view);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(req, res) {
	res.status(400);
	res.render('./partials/400', {title: 'Bad Request'});
});

// Handle 404
app.use(function(req, res) {
	res.status(404);
	res.render('./partials/404', {title: 'Not found'});
});

// Handle 500
app.use(function(error, req, res, next) {
	res.status(500);
	res.render('./partials/500', {title:'Internal Server Error', error: error});
});
// Handle 503
app.use(function(error, req, res, next) {
	res.status(503);
	res.render('./partials/503', {title:'Service Unavailable', error: error});
});

module.exports = app;
