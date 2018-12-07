'use strict'

const app = require('../server')
const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')

const { TEST_MONGODB_URI } = require('../config')

const User = require('../models/user')

const expect = chai.expect

chai.use(chaiHttp)

describe('Noteful API - Users', function () {
  const username = 'exampleUser'
  const password = 'examplePass'
  const fullname = 'Example User'

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true, useCreateIndex : true })
      .then(() => User.deleteMany({}));
  })

  beforeEach(function () {
    return User.createIndexes()
  });

  afterEach(function () {
    return User.deleteMany({})
  })

  after(function () {
    return mongoose.disconnect()
  })

  describe('POST /api/users', function () {

    it('Should create a new user', function () {
      let res;
      return chai
        .request(app)
        .post('/api/users')
        .send({ username, password, fullname })
        .then(_res => {
          res = _res
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.keys('id', 'username', 'fullname')
          expect(res.body.id).to.exist
          expect(res.body.username).to.equal(username)
          expect(res.body.fullname).to.equal(fullname)
          return User.findOne({ username })
        })
        .then(user => {
          expect(user).to.exist
          expect(user.id).to.equal(res.body.id)
          expect(user.fullname).to.equal(fullname)
          return user.validatePassword(password)
        })
        .then(isValid => {
          expect(isValid).to.be.true
        });
    })
    it('Should reject users with missing username', function () {
      return chai
        .request(app)
        .post('/api/users')
        .send({ password, fullname })
        .then(res => {
          expect(res).to.have.status(422)
          expect(res).to.be.json
          expect(res.body.reason).to.equal('Validation Error')
          expect(res.body.message).to.equal('Missing username or password')
          expect(res.body.location).to.equal('username')
        }) 
    })
    it('Should reject users with missing password', function () {
      return chai
      .request(app)
      .post('/api/users')
      .send({ username, fullname })
      .then(res => {
        expect(res).to.have.status(422)
        expect(res).to.be.json
        expect(res.body.reason).to.equal('Validation Error')
        expect(res.body.message).to.equal('Missing username or password')
        expect(res.body.location).to.equal('password')
      }) 
    })
    it('Should reject users with non-string username', function () {
      return chai
      .request(app)
      .post('/api/users')
      .send({ username: 123 })
      .then(res => {
        expect(res).to.have.status(422)
        expect(res).to.be.json
        expect(res.body.reason).to.equal('Validation Error')
        expect(res.body.message).to.equal('All fields must contain strings')
        expect(res.body.location).to.equal('username')
      })
    })
    it('Should reject users with non-string password', function () {
      return chai
      .request(app)
      .post('/api/users')
      .send({ username, password: 123 })
      .then(res => {
        expect(res).to.have.status(422)
        expect(res).to.be.json
        expect(res.body.reason).to.equal('Validation Error')
        expect(res.body.message).to.equal('All fields must contain strings')
        expect(res.body.location).to.equal('password')
      })
    })
    it('Should reject users with non-string fullname', function () {
      return chai
      .request(app)
      .post('/api/users')
      .send({ fullname: 123 })
      .then(res => {
        expect(res).to.have.status(422)
        expect(res).to.be.json
        expect(res.body.reason).to.equal('Validation Error')
        expect(res.body.message).to.equal('All fields must contain strings')
        expect(res.body.location).to.equal('fullname')
      })
    })
    it('Should reject users with non-trimmed username', function () {
      return chai
      .request(app)
      .post('/api/users')
      .send({ username: " Whitespaces ", password })
      .then(res => {
        expect(res).to.have.status(422)
        expect(res).to.be.json
        expect(res.body.reason).to.equal('Validation Error')
        expect(res.body.message).to.equal('Field cannot begin or end with whitespace')
        expect(res.body.location).to.equal('username')
      })
    })
    it('Should reject users with non-trimmed password', function () {
      return chai
      .request(app)
      .post('/api/users')
      .send({ username, password: " Whitespace " })
      .then(res => {
        expect(res).to.have.status(422)
        expect(res).to.be.json
        expect(res.body.reason).to.equal('Validation Error')
        expect(res.body.message).to.equal('Field cannot begin or end with whitespace')
        expect(res.body.location).to.equal('password')
      })
    })
    it('Should reject users with empty username', function () {
      return chai
      .request(app)
      .post('/api/users')
      .send({ username: '', password })
      .then(res => {
        expect(res).to.have.status(422)
        expect(res).to.be.json
        expect(res.body.reason).to.equal('Validation Error')
        expect(res.body.message).to.equal('Must be at least 1 character(s) long')
        expect(res.body.location).to.equal('username')
      })
    })
    it('Should reject users with a username greater than 30 characters', function () {
      return chai
      .request(app)
      .post('/api/users')
      .send({ username: ('a'.repeat(31)), password})
      .then(res => {
        expect(res).to.have.status(422)
        expect(res).to.be.json
        expect(res.body.reason).to.equal('Validation Error')
        expect(res.body.message).to.equal('Must be at most 30 characters long')
        expect(res.body.location).to.equal('username')
      })
    })
    it('Should reject users with password less than 8 characters', function () {
      return chai
      .request(app)
      .post('/api/users')
      .send({ username, password: "seven" })
      .then(res => {
        expect(res).to.have.status(422)
        expect(res).to.be.json
        expect(res.body.reason).to.equal('Validation Error')
        expect(res.body.message).to.equal('Must be at least 8 character(s) long')
        expect(res.body.location).to.equal('password')
      })
    })
    it('Should reject users with password greater than 72 characters', function () {
      return chai
      .request(app)
      .post('/api/users')
      .send({ username, password: ('a'.repeat(73))})
      .then(res => {
        expect(res).to.have.status(422)
        expect(res).to.be.json
        expect(res.body.reason).to.equal('Validation Error')
        expect(res.body.message).to.equal('Must be at most 72 characters long')
        expect(res.body.location).to.equal('password')
      })
    })
    it('Should reject users with duplicate username', function () {
      return User.create({ username, password, fullname })
      .then(() => {
        return chai.request(app)
        .post('/api/users')
        .send({ username, password, fullname })
      })
      .then(res => {
        expect(res).to.have.status(400)
        expect(res.body.message).to.equal('The username already exists')
        // expect(res.body.message).to.equal('The username already exists')
      })

    })
    it('Should trim fullname', function () {
      return chai
        .request(app)
        .post('/api/users')
        .send({ username, password, fullname: ` ${fullname} ` })
        .then(res => {
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.keys('id', 'username', 'fullname')
          expect(res.body.fullname).to.equal(fullname)
          return User.findOne({ username })
        })
        .then(user => {
          expect(user).to.not.be.null
          expect(user.fullname).to.equal(fullname)
        })
    })
  })
})