var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
const moviesRouter = require("./routes/movies");
const createuserRouter = require("./routes/createuser");
const loginuserRouter = require("./routes/loginuser");
const logoutuserRouter = require("./routes/logoutuser");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/createuser', createuserRouter);
app.use('/loginuser', loginuserRouter);
app.use('/logout', logoutuserRouter);
app.use("/movies", moviesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

process.on("exit", () => {
  fs.writeFile("movies.json", JSON.stringify(movies), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("movies.json saved!");
    }
  });
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
