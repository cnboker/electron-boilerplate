process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let User = require('../api/User/Model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server')
let should = chai.should();

chai.use(chaiHttp)

describe('Users', () => {

  beforeEach((done) => {
    User.remove({}, (err) => {
      done();
    })
  })

  describe('/api/bonus',()=>{
    it('add point',(done)=>{
      done();
    });
  });
  //test /api/signup
  describe('/api/signup', () => {
    it('it should not signup without username and password', (done) => {
      let user = {
        userName: '',
        password: '',
        email: ''
      }
      chai.request(server)
        .post('/api/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          console.log(err);
          done();
        })
    })
  })

  describe('/api/signup', () => {
    it('it should signup with username and password, create user', (done) => {
      let user = {
        userName: 'scott',
        password: '111111',
        email: '6348816@qq.com'
      }
      chai.request(server)
        .post('/api/signup')
        .send(user)
        .end((err, res) => {
          //console.log('err', err)
          //console.log('body', res.body);
          res.should.have.status(201);
          done();
        })
    })
  });

  //test /api/login
  describe('/api/login', () => {
    it('error password and login failure', (done) => {
      //perpair data
      let user = {
        userName: 'scott',
        password: '111111',
        email: '6348816@qq.com'
      }
      var u = new User(user);
      u.save()
        .then((doc) => {
          if (doc) {
            //action
            chai.request(server)
              .post('/api/login')
              .send({
                userName: 'scott',
                password: '1'
              })
              .end((err, res) =>{
                //assert
                console.log('err', err);
                res.should.have.status(400);
                done();
              });
          }

        })
        .then((err) => {
          console.log(err);
        });

    });
  });


  describe('/api/login', () => {
    it('login success', (done) => {
      //perpair data
      let user = {
        userName: 'scott',
        password: '111111',
        email: '6348816@qq.com'
      }
      var u = new User(user);
      u.save()
        .then((doc) => {
          if (doc) {
            //action
            chai.request(server)
              .post('/api/login')
              .send({
                userName: 'scott',
                password: '111111'
              })
              .end((err, res) =>{
                //assert
                console.log('body', res.body);
                res.should.have.status(200);
                done();
              });
          }

        })
        .then((err) => {
          console.log(err);
        });

    });
  });

});