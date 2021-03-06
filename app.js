var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const jwtAuth = require('./lib/jwtAuth');

// conectamos la base de datos
const conn = require('./lib/connectMongoose');

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
app.use(express.static(path.join(__dirname, 'uploads')));

//configurar multiidioma
const i18n = require('./lib/i18nConfigure')();
app.use(i18n.init);


const loginController = require('./routes/loginController');

/**
 * Middlewares de mi api
 */
app.use('/api/anuncios',jwtAuth(), require('./routes/apiv/anuncios'));
app.use('/api/authenticate', loginController.postLoginJWT);

//middleware de control de sessiones
app.use(session({
    name: 'nodepop-session',
    secret: 'askjdahjdhakdhaskdas7dasd87asd89as7d89asd7a9s8dhjash',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true }, // dos dias de inactividad
    store: new MongoStore({
        mongooseConnection: conn
    })
}));


/**
 * Middlewares de mi apliación web
 */
app.post('/login', loginController.post);
app.use('/login', loginController.index);
app.use('/logout', loginController.logout);

app.use('/',      require('./routes/index'));
app.use('/lang',  require('./routes/lang'));
app.use('/users', require('./routes/users'));
app.use('/admin', require('./routes/admin'));



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
  return req.originalUrl.indexOf('/api') === 0;
}


module.exports = app;
