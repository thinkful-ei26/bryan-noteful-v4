'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tag');


mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useCreateIndex: true})
  .then(() => {
    const newNote = {
      title: '5 Things I Love About Bacon',
      content: 'Bacon ipsum dolor amet buffalo chicken tongue kevin, tri-tip tail drumstick ham doner pastrami swine corned beef biltong shank salami.',
      userId: '000000000000000000000001',
      folderId: '222222222222222222222201'
    };
    if (!mongoose.Types.ObjectId.isValid(newNote.folderId)) {
      const err = new Error('The `folderId` is not valid');
      err.status = 400;
      return Promise.reject('Why you gotta do that for 1');
    }
    return Folder.countDocuments({
      _id: '222222222222222222222201',
      userId: '000000000000000000000001'
    })
      .then(results => {
        console.log(results);
        if (results) {
          return Note.create(newNote);
        } else {
          return Promise.reject('Why you gotta do that for 2')
        }
      })
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
