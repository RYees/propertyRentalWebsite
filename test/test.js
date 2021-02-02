const assert = require('assert');
const { exception } = require('console');
const { token } = require('morgan');
const expect = require('chai').expect
const request = require('supertest');

const app = require('../app');

const { nest }  = require('../middlewares/auth')

describe('Test Route and controller', function () {
    it('If we send Login with empty body should return bad request', function() {
       return request(app)
      .post('/Aauth/login')
      .expect(400)
      
    })
  
    it('If send with invalid username/password should return 401', function() {
      return request(app)
     .post('/Aauth/login')
     .send({
      "username": "invalid user ",
      "password": "invalid password"
      })
     .expect(400)
   })
  
   it('If send with valid username/password should return 200 wit valid object', function() {
    let user = {
      "username": "admin",
      "password": "superuser"
      }
    return request(app)
   .post('/Aauth/login')
   .send(user)
   .expect(200)
   .then((res) => {
     const {username, active, token} = res.body
  
     expect(username).to.be.equal(user.username)
     expect(active).to.be.equal(true)
     expect(token).to.exist
   })
  })
   
  })
  