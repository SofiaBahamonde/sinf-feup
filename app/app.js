var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var helpers = require('handlebars-helpers');
var comparison = helpers.comparison();

// Authentication
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tech4u');


// Routes
var routes = require('./routes/index');
var user = require('./routes/user');
var auth = require('./routes/auth');
var product = require('./routes/product');
var cart = require('./routes/cart');
var catalog = require('./routes/catalog');
var admin = require('./routes/admin');


var app = express();

// view engine setup
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Global Vars
app.use(function (req, res, next) {
    res.locals.user = req.user || null;

    let total =0;
    try {
        var cart = JSON.parse(req.cookies['cart']);
      } catch (err) {
        cart = null; 
      }
      
    if(cart != null){
        cart.forEach(function(element, index, a) {
            total += cart[index].count;
        }
    )};
    res.locals.total = total;
    next();
  });

// Routes
app.use('/', routes);
app.use('/user', user);
app.use('/auth', auth);
app.use('/product', product);
app.use('/cart', cart);
app.use('/catalog', catalog);
app.use('/admin', admin);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
