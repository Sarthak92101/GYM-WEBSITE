var express = require('express');
var router = express.Router();
const usermodel = require("./users");
const passport = require('passport');
const localstrategy = require("passport-local");
passport.use(new localstrategy(usermodel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.visit = true;
  res.render('index');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/price', function(req, res, next) {
  res.render('price');
});
router.get('/pay', isLoggedIn, function(req, res, next) {
  res.render('pay');
});

router.get('/profile', isLoggedIn,function(req, res, next){
  res.render('profile')
})

router.get('/registerpage', function(req, res, next){
  res.render('register');
})

router.get('/loginpage', function(req, res, next){
  res.render('login');
})

router.post('/register', function(req, res, next) {
  var userdata = new usermodel({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
  });

  usermodel.register(userdata, req.body.password)
  .then(function (registerreduser){
    passport.authenticate("local")(req, res, function(){
      res.redirect('/profile');
    });
  });
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}), function(req, res){
});

router.get("/logout", function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect("/loginpage");
}

module.exports = router;
