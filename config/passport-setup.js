const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(function(user) {
    done(null, user);
  });
});

passport.use(new GoogleStrategy({
  callbackURL: '/auth/google/redirect',
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret
  }, function(accessToken, refreshToken, profile, done) {
    User.findOne({googleID: profile.id}).then(function(currentUser) {
      if(currentUser) {
        console.log(currentUser);
        done(null, currentUser);
      }
      else {
        new User({
          username: profile.displayName,
          googleID: profile.id,
          thumbnail: profile._json.image.url
        }).save().then(function(newUser) {
          console.log(newUser);
          done(null, newUser);
        });
      }
    });
}));
