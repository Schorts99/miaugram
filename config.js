'use strict'

const config = {
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY
  },
  client: {
    endpoints: {
      pictures: 'http://api.miaugram.com/picture',
      users: 'http://api.miaugram.com/user',
      auth: 'http://api.miaugram.com/auth'
    }
  },
  auth: {
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://miaugram.com/auth/facebook/callback'
    }
  },
  secret: process.env.MIAUGRAM_SECRET || 'mi4ugr4m'
}

if (process.env.NODE_ENV !== 'production') {
  config.client.endpoints = {
    pictures: 'http://localhost:5000',
    pictures: 'http://localhost:5001',
    pictures: 'http://localhost:5002'
  },

  config.auth.facebook.callbackURL = 'http://miaugra.test:5050/auth/facebook/callback'
}

module.exports = config
