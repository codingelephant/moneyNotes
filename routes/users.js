var express = require('express');
var router = express.Router();
var models = require('../models');
var bcrypt = require('bcrypt');
var passport = require('passport');
var auth = require('connect-ensure-login').ensureLoggedIn;

/* GET show register form. */
router.get('/register', function(req, res, next) {
  res.render('auth/register',{title:'Register'});
});

/* POST store a user into db. */
router.post('/register', function(req, res, next) {
   let formData = req.body;
  //hash password
  var saltRounds = 10;
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(formData.password, salt);
      formData.password = hash;

       models.User.create(formData).then(function(result){
        console.log(result);
        console.log("ok");
        return res.redirect("/auth/login");
       })
       .catch(function(err){
        console.log(err);
        
       });
  
});


/* GET show login form. */
router.get('/login', function(req, res, next) {
  res.render('auth/login',{title:'Login'});
});

/* POST login */
router.post('/login',  passport.authenticate('local', { 
  successRedirect: '/notes', 
  failureRedirect: '/auth/login',  
  failureFlash: true }), 
function(req, res, next) {
 //ok 
 res.redirect("/notes");
});


router.get('/logout', auth('/auth/login'), function(req, res){
  req.logout();
  return res.redirect("/auth/login");
})

module.exports = router;
