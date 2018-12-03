'use strict';

const express = require('express');
// const mongoose = require('mongoose');
const User = require('../models/user');
const router = express.Router();

/* ========== CREATE A USER ========== */
router.post('/', (req, res, next) => {
  let { fullname = '', username, password } = req.body;
  fullname = fullname.trim();
  // Set an array containing required fields
  const requiredFields = ['username', 'password'];
  // Iterate through requiredFields - returns value of first element matching parameters
  const missingFields = requiredFields.find(field => !(field in req.body));

  if (missingFields) {
    // Status 422: Unprocessable Entity
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: 'Missing username or password',
      location: missingFields
    })
  }

  const stringFields = ['username', 'password', 'fullname'];
  const nonStringField = stringFields.find(field => field in req.body && typeof req.body[field] !== 'string');

  if (nonStringField) {
    // Status 422: Unprocessable Entity
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: 'All fields must contain strings',
      location: nonStringField
    })
  }

  const trimmedFields = ['username', 'password'];
  const nonTrimmedField = trimmedFields.find(field => req.body[field].trim() !== req.body[field]);

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: 'Field cannot begin or end with whitespace',
      location: nonTrimmedField
    });
  }

  const fieldSize = {
    username: {
      min: 1,
      max: 30
    },
    password: {
      min: 8,
      max: 72
    }
  };
    // Object.keys will return an array of object property names
  const tooSmall = Object.keys(fieldSize).find(field =>
    // In returns true if the specified property is in the specified object
    // We are comparing the trimmed length of the request and making sure it is greater than our set min
    'min' in fieldSize[field] && req.body[field].trim().length < fieldSize[field].min);

  const tooBig = Object.keys(fieldSize).find(field =>
    'max' in fieldSize[field] && req.body[field].trim().length > fieldSize[field].max)
  
  if (tooSmall || tooBig) {
    return res.status(422).json({
      code: 422, 
      reason: 'Validation Error',
      // Ternary operator pluging in the result of line 63/68 into our fieldSize object
      message: tooSmall ? `Must be at least ${fieldSize[tooSmall].min} character(s) long` 
        : `Must be at most ${fieldSize[tooBig].max} characters long` ,
      location: tooSmall || tooBig
    });
  }

  return User.hashPassword(password)
  .then(digest => {
    const newUser = {
      username,
      password: digest,
      fullname
    };
    return User.create(newUser);
  })
  .then(result => {
    return res.status(201).location(`${req.originalUrl}/${result.id}`).json(result);
  })
  .catch(err => {
    if (err.code === 11000) {
      err = new Error('The username already exists');
      err.status = 400;
    }
    next(err);
  });
});

module.exports = router;