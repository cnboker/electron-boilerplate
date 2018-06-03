process.env.NODE_ENV = 'test'

let mongoose = require('mongoose')
let Keyword = require('../api/Keyword/Model')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should();
let expect = chai.expect;
var dbInit = require('../../data/scripts/init')

const access_token = require('../auth')
chai.use(chaiHttp)

describe("/api/kwTask/tasks", () => {

  beforeEach((done)=>{
    dbInit(()=>{
      done();
    });

  });

  it('it should return json list', (done) => {
    chai.request(server)
      .get('/api/kwTask/tasks')
      .set('Authorization', `Bearer ${access_token}`)
      //.expect(200)
      .end((err, res) => {
        console.log('err', err)
        res.should.have.status(200);
        //console.log('res.body', res.body);
        expect(err).to.be.null;
        expect(res).to.be.json;
        //res.body.should.have.property('data')
        expect(res.body).to.have.lengthOf(7);
        done(err);
      });
  })
});

describe('/api/kwTask/rank', () => {
  it('set rank = 30,return rank=30', (done) => {
    //add keyword
    let keyword = new Keyword({
      keyword: 'test',
      link: 'ioliz.com',
      originRank: 0,
      dynamicRank: 0
    });
    keyword.save()
      .then((doc) => {
        if (doc) {
          chai.request(server)
            .post('/api/kwTask/rank')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
              _id: doc._id,
              rank: 30
            })
            .end((err, res) => {
              console.log('body', res.body)
              res.should.have.status(200);
              expect(err).to.be.null;
              expect(res.body.originRank).to.be.equal(30);
              done();
            });
        }
       // done();
      });

  })
  //it end
})
//describle end


describe('/api/kwTask/polish', () => {
  it('set dynamicRank = 20, return dynamicRank =20', (done) => {
    let keyword = new Keyword({
      keyword: 'test',
      link: 'ioliz.com',
      originRank: 0,
      dynamicRank: 0,
      polishedCount:0
    });
    keyword.save()
      .then((doc) => {
        if (doc) {
          chai.request(server)
            .post('/api/kwTask/polish')
            .set('Authorization', `Bearer ${access_token}`)
            .send({
              _id: doc._id, 
              rank: 20
            })
            .end((err, res) => {
              console.log('body----', res.body)
              res.should.have.status(200);
              expect(err).to.be.null;
              expect(res.body.dynamicRank).to.be.equal(20);
              expect(res.body.polishedCount).to.be.equal(1);
              done();
            });
        }
       // done();
      });
  })
})