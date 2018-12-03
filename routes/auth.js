'use strict';

const express = require('express');
// const User = require('../models/user');
const router = express.Router();
const passport = require('passport');


const options = {session: false, failWithError: true};
const localAuth = passport.authenticate('local', options);

/* ========== VALIDATE USER ========== */
router.post('/', localAuth, function (req, res) {
  return res.json(req.user);
})

module.exports = router;