process.env.NODE_ENV = 'test'

let mongoose = require('mongoose')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp)

const access_token = require('../auth').access_token
var dbInit = require('../../data/scripts/init')
let QRPay = require('../api/QRPay/Model')

beforeEach(function (done) {
  dbInit(function () {
    //console.log('dbinit')
    done();
  });
});

describe('/api/qr/pending', () => {
  it('初次请求，创建临时订单,返回200', (done) => {
    chai
      .request(server)
      .get('/api/qr/pending')
      .set('Authorization', `Bearer ${access_token}`)
      .end((err, res) => {
        if (err) {
          console.error(err)
          return done(err)
        }
        res
          .should
          .have
          .status(200)
        done();
      })
  })

  it('二次请求，返回上次的临时订单,返回200', (done) => {
    let paycode = '';
    chai
      .request(server)
      .get('/api/qr/pending')
      .set('Authorization', `Bearer ${access_token}`)
      .end((err, res) => {
        if (err) {
          console.error(err)
          return done(err)
        }
        res
          .should
          .have
          .status(200)
        paycode = res.body.paycode;
        chai
          .request(server)
          .get('/api')
          .set('Authorization', `Bearer ${access_token}`)
          .end((err, res) => {

            if (err) 
              return done(err)
            expect(paycode)
              .to
              .equal(res.body.paycode)
            done()
          })
      })

  })

  it('一天一个用户最多只能提交3张单，防止滥用,返回200', (done) => {
    done()
  })
})

describe('/api/qr/submit', () => {

  it('付款后会员提交临时订单', (done) => {
    chai
      .request(server)
      .post('/api/qr/submit')
      .set('Authorization', `Bearer ${access_token}`)
      .send({payno: '12345678'})
      .end((err, res) => {
        if(err){
          console.error(err)
          return done(err)
        }
        res
          .should
          .have
          .status(200)
        expect(res.body.status)
          .to
          .be
          .equal(1) //submit
        done();
      })
  })

})

describe('/api/qr/confirm', () => {
  it('后台收款人确认临时订单', (done) => {
    chai
      .request(server)
      .post('/api/qr/confirm')
      .set('Authorization', `Bearer ${access_token}`)
      .send({payno: '12345678'})
      .end((err, res) => {
        if(err){
          console.error(err)
          return done(err)
        }
        res
          .should
          .have
          .status(200)
        expect(res.body.status)
          .to
          .be
          .equal(2) //confirm
        done();
      })

  })
})

describe('/api/qr/cancel', () => {
  it('未付款收款人取消临时订单', (done) => {
    chai
      .request(server)
      .post('/api/qr/cancel')
      .set('Authorization', `Bearer ${access_token}`)
      .send({payno: '12345678'})
      .end((err, res) => {
        if (err) 
          return done(err)
        res
          .should
          .have
          .status(200)
        expect(res.body.status)
          .to
          .be
          .equal(3) //cancel
        done();
      })

  })
})

describe('/api/qr/list', () => {
  it('获取微信付款列表', (done) => {
    chai
      .request(server)
      .get('/api/qr/list?page=0&limit=30')
      .set('Authorization', `Bearer ${access_token}`)
      .end((err, res) => {
        if(err){
          console.error(err)
          return done(err)
        }
        console.log('qrlist',res.body)
        res
          .should
          .have
          .status(200)
        expect(res.body.docs.length)
          .to
          .be
          .equal(1)
        done();
      })
  })
})

