var LocalStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var miaugram = require('miaugram-client');
var swt = require('jsonwebtoken');
var config = require('./config');
var client = miaugram.createClient(config.client);

exports.LocalStrategy = new LocalStrategy((username, password, done) => {
  client.auth(username, password, (err, token) => {
    if (err) {
      return done(null, false, { message: 'Username or password not found' });
    }

    client.getUser(username, (err, user) => {
      if (err) {
        return done(null, false, { message: `An error ocurred: ${err.message}` })
      }

      user.token = token;

      return done(null, user);
    })
  })
});

exports.facebookStrategy = new facebookStrategy({
  clientId: config.auth.facebook.clientId,
  clientSecret: config.auth.facebook.clientSecret,
  callbackURL: config.auth.facebook.callbackURL,
  profileField: ['id', 'displayName', 'email']
}, function (accessToken, refreshToken, profile, done) {
  var userProfile = {
    username: profile._json.id,
    name: profile._json.name,
    email: profile._json.email,
    facebook: true
  }

  findOrCreate(userProfile, (err, user) => {
    if (err) return done(err);

    jwt.sign({ userId: user.username }, config.secret, {}, (e, token) => {
      if (e) return done(e);

      user.token = token;

      return done(null, user);
    })

    return done(null, user);
  })

  function findOrCreate(user, callback) {
    client.getUser(user.username, (err, usr) => {
      if (err) {
        return client.saveUser(user, callback);
      }

      callback(null, user);
    })
  }
});

exports.serializeUser = function (user, done) {
  done(null, {
    username: user.username,
    token: user.token
  });
}

exports.deserializeUser = function (user, done) {
  client.getUser(user.username, (err, usr) => {
    usr.token = user.token;
    done(err, usr);
  });
}
