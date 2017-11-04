const express = require('express');
const auth = require('./routes/auth');
const profile = require('./routes/profile');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');

const app = express();

app.set('view engine', 'ejs');

mongoose.connect(keys.mongodb.dbURI, function() {
  console.log('Connected to mongodb');
});

app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.render('home', {
    user: req.user
  });
});

app.use('/auth', auth);
app.use('/profile', profile);

app.listen(4000, function() {
    console.log('Listening to port 4000');
});
