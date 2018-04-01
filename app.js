var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');

const session = require('express-session');

// conectamos la base de datos
require('./lib/connectMongoose');

// cargamos los modelos para que mongoose los conozca
require('./models/Anuncio');
require('./models/Usuario');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.locals.title = 'Node';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//middleware de estáticos
app.use(express.static(path.join(__dirname, 'public')));

//configurar multiidioma
const i18n = require('./lib/i18nConfigure')();
app.use(i18n.init);

/**
 * Middlewares de mi api
 */
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));

//middleware de control de sessiones
app.use(session({
    name: 'nodepop-session',
    secret: 'askjdahjdhakdhaskdas7dasd87asd89as7d89asd7a9s8dhjash',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true }, // dos dias de inactividad
}));


/**
 * Middlewares de mi apliación web
 */
const loginController = require('./routes/loginController');
app.post('/login', loginController.post);
app.use('/login', loginController.index);
app.use('/logout', loginController.logout);

app.use('/',      require('./routes/index'));
app.use('/lang',  require('./routes/lang'));
app.use('/users', require('./routes/users'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {

  if (err.array) { // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = `Not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  res.status(err.status || 500);

  // si es una petición de API, respondemos con JSON
  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // Respondo con una página de error

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

function isAPI(req) {
  return req.originalUrl.indexOf('/apiv') === 0;
}


module.exports = app;
