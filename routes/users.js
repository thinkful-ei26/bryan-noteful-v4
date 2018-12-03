'use strict';

const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const router = express.Router();

/* ========== CREATE A USER ========== */
router.post('/', (req, res, next) => {
  const { fullname, username } = req.body;

  const newUser = { fullname, username };

  /***** Never trust users - validate input *****/
  // if (!name) {
  //   const err = new Error('Missing `name` in request body');
  //   err.status = 400;
  //   return next(err);
  // }

  User.create(newUser)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Username already exists');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;