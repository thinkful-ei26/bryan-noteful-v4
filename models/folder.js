'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }
});

// Add `createdAt` and `updatedAt` fields
schema.set('timestamps', true);

// Folder names should be unique for each user
schema.index({ name: 1, userId: 1}, { unique: true });

// Transform output during `res.json(data)`, `console.log(data)` etc.
schema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = mongoose.model('Folder', schema);
