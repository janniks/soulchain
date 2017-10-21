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
    var p = new ibk.Models.Profile({
      accessToken: accessToken,
      refreshToken: refreshToken,
      profile: profile
    });
    
    p.save()
    .then(function (profile) {
      log.info('Successfully saved profile.');
    })
    .catch(function (error) {
      log.error('Failed to save profile. Maybe the profile already exists.');
    });
    return cb(null, profile);
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

//### Routes ###################################################################
router.use(passport.initialize());
router.use(passport.session());

//### Handlers #################################################################
router.get('/', function (req, res) {
  ibk.Models.Profile.find({ }).exec(function(error, profiles) {
    if (error) {
      return res.render('home');
    }

    return res.render('home', {
      users: profiles
    });    
  });
});

router.get('/login/facebook', passport.authenticate('facebook'));

router.get('/login/facebook/return', passport.authenticate('facebook', { failureRedirect: '/' }), function(req, res) {
	res.redirect('/');
});

// Export router
module.exports = router;
