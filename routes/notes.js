'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tag');
const passport = require('passport');
const router = express.Router();

// Protect endpoints with web token
router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

// Create validation functions
const validateFolders = async (folderId, userId) => {
  if (folderId === undefined) {
    return Promise.resolve()
  }
  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('The folderId is not valid')
    err.status = 400
    return Promise.reject(err)
  }
  console.log('folderId is ', folderId);
  await Folder.find({
    userId: req.user.id
  })
}

const validateTags = async (tags, userId) => {
  if (tags === undefined) {
    return Promise.resolve()
  }
  if (tags) {
    const badIds = tags.filter((tag) => !mongoose.Types.ObjectId.isValid(tag))
    if (badIds.length) {
      const err = new Error('The `tags` array contains an invalid `id`')
      err.status = 400
      return next(err)
    }
  }
  await Tag.find({ $and: [{ _id: { $in: tags }, userId }]})
    .then(results => {
      if (tags.length !== results.length) {
        const err = new Error ('The tags array contains an invalid id')
        err.status = 400
        return Promise.reject(err)
      }
    })
}

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm, folderId, tagId} = req.query;
  const userId = req.user.id;
  let filter = { userId };

  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    filter.$or = [{ 'title': re }, { 'content': re }];
  }

  if (folderId) {
    filter.folderId = folderId;
  }

  if (tagId) {
    filter.tags = tagId;
  }

  Note.find(filter)
    .populate('tags')
    .sort({ updatedAt: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findOne({_id: id, userId})
    .populate('tags')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { title, content, folderId, tags } = req.body;
  const userId = req.user.id;
  
  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const newNote = { title, content, folderId, tags, userId};
  if (newNote.folderId === '') {
    delete newNote.folderId;
  }

  Promise.all([
    validateFolders(newNote.folderId, userId),
    validateTags(newNote.tags, userId) 
  ])
    .then(() => {
      // console.log('results are ', results);
      // if (results) {
        return Note.create(newNote)
      // } 
          .then((response) => {
            res.location(`${req.originalUrl}/${response.id}`).status(201).json(response)
          })
          .catch(err => {
            next(err)
          })
    })
  // Note.create(newNote)
  //   .then(result => {
  //     res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
  //   })
  //   .catch(err => {
  //     next(err);
  //   });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const toUpdate = {};
  const updateableFields = ['title', 'content', 'folderId', 'tags'];
  // userId = toUpdate[userId];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (toUpdate.title === '') {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (toUpdate.folderId === '') {
    delete toUpdate.folderId;
    toUpdate.$unset = {folderId : 1};
  }

  Promise.all([
    validateFolders(toUpdate.folderId, userId),
    validateTags(toUpdate.tags, userId)
  ])
    .then(() => {Note.findByIdAndUpdate({_id: id, userId}, toUpdate, { new: true }).populate('tags')})
    .then(result => {result ? res.json(result) : next()})
    .catch(err => {next(err)})
})

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findByIdAndRemove({_id: id, userId})
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
