const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const userApi = require('./routes/userApi')
const adminApi = require('./routes/adminApi')
const openApi = require('./routes/openApi')

const adminAuth = require('./authorizers/adminAuthorizer')
const userAuth = require('./authorizers/userAuthorizer')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("qawesrdtfyguhij"));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/public',  express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter);

app.use('/open', openApi)

// User Api
app.use('/user', userAuth)
app.use('/user', userApi)

// Admin Api
app.use('/admin', adminAuth)
app.use('/admin', adminApi)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
