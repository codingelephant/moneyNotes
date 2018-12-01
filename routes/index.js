var express = require('express');
var router = express.Router();
var email 	= require("emailjs/email");

var mailServer 	= email.server.connect({
   user:  process.env.MAIL_USER,
   password: process.env.MAIL_PASS,
   host:  process.env.MAIL_HOST,
   port:  process.env.MAIL_PORT,
   tls:   true
});


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('index', {title:'Welcome'});
});

/* GET support page. */
router.get('/support', function(req, res, next) {
    res.render('support', {title:'Support'});
});

/* POST send contact message to site admin */
router.post('/support', function(req, res, next) {
    let formData = req.body;
    mailServer.send({
        text:    formData.message,
        from:    formData.name+" <"+formData.email+">",
        to:   "naysumyat2011@gmail.com",
        cc:   "nay@codingelephant.tech",
        subject: formData.subject
     }, function(err, message) { 
        console.log(err || message);
        req.flash("success","Successfully sent the message!");
        return res.redirect('/support');
     });
});
  
module.exports = router;

