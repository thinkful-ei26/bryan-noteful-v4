'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  fullname: { type: String},
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true}
});

// Add `createdAt` and `updatedAt` fields
// schema.set('timestamps', true);

// Transform output during `res.json(data)`, `console.log(data)` etc.
schema.set('toObject', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
    delete result.password;
  }
});

module.exports = mongoose.model('User', schema);