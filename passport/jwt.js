'use strict';

const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('../config');


/*  JwtStrategy
secretOrKey: REQUIRED unless secretOrKeyProvider is provided.
jwtFromRequest: REQUIRED
*/

const jwtOptions = {
  secretOrKey: JWT_SECRET, 
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  algorithms: ['HS256'] 
};

const jwtStrategy = new JwtStrategy(jwtOptions, (payload, done) => {done(null, payload.user);})

module.exports = jwtStrategy ;

passport.use(jwtStrategy);