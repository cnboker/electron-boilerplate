let mongoose = require('mongoose')
let Balance = require('../api/Balance/Model')

let chai = require('chai')
let chaiHttp = require('chai-http');
let server = require('../server')
let should = chai.should()
let expect = chai.expect
var dbInit = require('../../data/scripts/init')
var moment = require('moment')

const access_token = require('../auth').access_token
chai.use(chaiHttp)

describe('balance', () => {

  beforeEach((done) => {
    dbInit(() => {
      done();
    })
  })

  describe('/api/pay', () => {

    it('amount < 199 should return "付费金额不能小于单价"', (done) => {
     
      chai.request(server)
        .post('/api/pay')
        .set('Authorization', `Bearer ${access_token}`)
        .send({
          userName: 'scott',
          amount: 20
        })
        .end((err, res) => {
          res.should.have.status(400);
     
          res.body.message.should.eql('付费金额不能小于单价');
          done();
        })
    });


    it('common user become vip user should return vip info', (done) => {
      chai.request(server)
        .post('/api/pay')
        .set('Authorization', `Bearer ${access_token}`)
        .send({
          userName: 'scott',
          amount: 199
        })
        .end((err, res) => {
          //console.log(res.body)
          res.should.have.status(200);
          expect(res.body.grade).to.be.equal(2);
          done();
        })
    });

    it('vip user charge return vip info', (done) => {
      chai.request(server)
        .post('/api/pay')
        .set('Authorization', `Bearer ${access_token}`)
        .send({
          userName: 'vipUser',
          amount: 199
        })
        .end((err, res) => {
          res.should.have.status(200);
          //console.log('expireddate=', res.body.vipExpiredDate)
          var s1 = moment(res.body.vipExpiredDate, 'YYYY-MM-DD');
          var current = moment().startOf('day');
          var days = moment.duration(s1.diff(current)).asDays();
          expect(days).to.be.equal(30)
          done();
        })
    });

    it('vip charge amount equal 0 return exception', (done) => {
      chai.request(server)
        .post('/api/pay')
        .set('Authorization', `Bearer ${access_token}`)
        .send({
          userName: 'scott',
          amount: 0
        })
        .end((err, res) => {
          res.should.have.status(400);

          done();
        })
    });

  })

})