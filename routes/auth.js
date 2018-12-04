'use strict';

const express = require('express');
// const User = require('../models/user');
const router = express.Router();
const passport = require('passport');
const { JWT_SECRET , JWT_EXPIRY } = require('../config');


const options = {session: false, failWithError: true};
const localAuth = passport.authenticate('local', options);

/* ========== VALIDATE USER ========== */
router.post('/', localAuth, function (req, res) {
  return res.json(req.user);
})

// Create a Json Web Token //
function createAuthToken (user) {
  /* jwt.sign(payload, secretOrPrivateKey, [options, callback])
(Asynchronous) If a callback is supplied, the callback is called with the err or the JWT.
(Synchronous) Returns the JsonWebToken as string
payload could be an object literal, buffer or string representing valid JSON.*/
  return JWT_EXPIRY.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

module.exports = router;