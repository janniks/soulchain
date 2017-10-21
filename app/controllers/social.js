var router = ibk.router();

var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

//# API ########################################################################

//## Social ####################################################################
passport.use(new Strategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'http://localhost:8080/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    log.info('profile', profile);
    return cb(null, profile);
  }
));

passport.serializeUser(function(user, cb) {
  log.info('user', user);
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  log.info('obj', obj);
  cb(null, obj);
});

//### Routes ###################################################################
router.use(passport.initialize());
router.use(passport.session());

//### Handlers #################################################################
router.get('/login', function(req, res){
	res.render('login');
});

router.get('/login/facebook', passport.authenticate('facebook'));

router.get('/login/facebook/return', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
	res.redirect('/');
});

router.get('/profile', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
	res.render('profile', { user: req.user });
});

router.get('/', function (req, res) {
  return res.render('home', { user: req.user });
});

// Export router
module.exports = router;
