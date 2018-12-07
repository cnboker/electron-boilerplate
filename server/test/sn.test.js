process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let SN = require('../api/SN/Model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server')
let should = chai.should();
const access_token = require('../auth').access_token
var dbInit = require('../../data/scripts/init')

chai.use(chaiHttp)

describe('SN', () => {

  beforeEach((done) => {
    dbInit(function () {
      done();
    });
  })

  //test /api/signup
  describe('/api/sn/snCreate', () => {
    it('create sn return 200', (done) => {
      let sn = {
        userName: 'scott',
        mobile: '13410053353',
        snCount: 5,
        price: 200,
        payPrice: 150
      }
      chai
        .request(server)
        .post('/api/sn/snCreate')
        .set('Authorization', `Bearer ${access_token}`)
        .send(sn)
        .end((err, res) => {
          res
            .should
            .have
            .status(200);
          //console.log(err);
          done();
        })
    })
  })

  describe('/api/sn/snActivate', () => {
    it('activate sn return 200', (done) => {
      var sn = new SN({
        userName: 'agent1',
        mobile: '13410332234',
        sn: '123456',
        createDate: new Date(),
        actived: 0,
        isPaid: 0,
        Price: 200
      })
      sn
        .save()
        .then(doc => {
          let sn = {
            sn: '123456'
          }

          chai
            .request(server)
            .post('/api/sn/snActivate')
            .set('Authorization', `Bearer ${access_token}`)
            .send(sn)
            .end((err, res) => {
              res
                .should
                .have
                .status(200);
              done();
            })
        })
    })

  });

  //test /api/sn/list
  describe('/api/sn/list', () => {
    it('sn list return 200', (done) => {
      chai
        .request(server)
        .get('/api/sn/list')
        .set('Authorization', `Bearer ${access_token}`)
        .end((err, res) => {
          //assert console.log('err', err);
          res
            .should
            .have
            .status(200);
          done();
        });

    });
  });

});