require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

var models = require('./models');
var indexRouter = require('./routes/index');
var notesRouter = require('./routes/notes');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'didodiodiodiodidoidoidoi',
  resave: false,
  saveUninitialized: true,
 /// cookie: { secure: true }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  res.locals.flash_info = req.flash("infos");
  res.locals.flash_success = req.flash("success");
  res.locals.flash_error = req.flash("error");
  res.locals.user = (req.user) ? req.user : null;

 next();
});
app.use('/', indexRouter);
app.use('/notes', notesRouter);
app.use('/auth', usersRouter);


// passport config
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    console.log("checking login...");
       models.User.findOne({where:{email:email}}).then(function(result){
        if (!result) { return done(null, false, { message: 'There is no account associated with that email' }); } // there is no user with that email
        //check if password is correct 
        let yes = bcrypt.compareSync(password, result.password); // true
        if(yes){
          return done(null, result);
        }else{
          return done(null, false, { message: 'Your password is incorrect!'});
        }
        
       })
       .catch(function(err){
          if (err) { return done(err); }
       });

  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("user info accessed");
  models.User.findOne({where:{id:id}}).then(function(result){
    if (!result) { return done(null, false); }
    return done(null, result);
   })
   .catch(function(err){
      if (err) { return done(err); }
   });

});

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
