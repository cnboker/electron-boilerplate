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

describe("/api/keyword/tasks",()=>{
    it('it should return json list',(done)=>{
      chai.request(server)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${access_token}`)
      //.expect(200)
      .end((err,res)=>{
        console.log('err',err)
        res.should.have.status(200);
        console.log('res.body', res.body);
        expect(err).to.be.null;
        expect(res).to.be.json;
        //res.body.should.have.property('data')
        expect(res.body).to.have.lengthOf(7);
        done(err);
      });
    })
});