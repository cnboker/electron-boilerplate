process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let fs = require('fs')
let chai = require('chai');
var expect = require('chai').expect;
let chaiHttp = require('chai-http');
let server = require('../server')
let should = chai.should();
const access_token = require('../auth').access_token
var dbInit = require('../../data/scripts/init')

chai.use(chaiHttp)

describe('upload file', () => {
  //test /api/uploadfile
  describe('/api/uploadfile', () => {
    it('upload return 200', (done) => {
      chai
        .request(server)
        .post('/api/fileUpload')
        .set('Authorization', `Bearer ${access_token}`)
        .attach('file', fs.readFileSync('./test/images/test.jpg'), 'qr.jpg')
        .end((err, res) => {
          if(err){
            done(err)
          }
          
          expect(res)
            .to
            .have
            .status(200)
            expect(res.body).to.exist
          //console.log(res);
          done();
        })
    });
  })
});
