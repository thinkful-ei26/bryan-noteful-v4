'use strict';

const bcrypt = require('bcryptjs');
const password = 'shenanigans';

bcrypt.hash(password, 12)
  .then(digest => {
    console.log('digest = ', digest);
    return digest;
  })
  .catch(err => {
    console.error('error = ', err);
  });
  