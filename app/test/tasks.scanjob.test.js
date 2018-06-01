process.env.NODE_ENV = 'test'

// const assert = require('assert');

// describe('smoke test',function(){
//   it('checks equality',function(){
//     assert.equal(true,false)
//   });
// });

// const chai = require('chai');
// const expect = chai.expect;

// describe('smoke test',function(){
//   it('check equality',function(){
//     expect(true).to.be.false;
//   })
// })
var path = require('path')
//console.log(path.resolve('./'))
require('dotenv').config({
  path: './.env'
});

let chai = require('chai')
let chaiHttp = require('chai-http');
let server = require('../../server/server')
let should = chai.should();
let expect = chai.expect;
describe('scanJober',()=>{
  beforeEach((done)=>{
    initdb(()=>{
      done();
    });
  })

  after((done)=>{
    done();
  })

  describe('task execute',()=>{
      it('it should return 6 docs',(done)=>{
          var jobContextMock = {
             tasks:[],
            addTask:function(item){
              jobContextMock.tasks.push(item);
            }
          }
          const Scanjob = require('../src/tasks/baidu/scanJober');
          Scanjob.execute(jobContextMock).then(()=>{
            console.log('jobContextMock.tasks.length',jobContextMock.tasks.length)
            expect(6).to.equal(jobContextMock.tasks.length);
            done();
          })
        
      })

  })



})


function initdb(cb) {
  const {
    exec
  } = require('child_process');
  exec('mongo ../data/scripts/create-db.js', function (err, stdout, stderr) {
    if (err) {
      console.log(`err:${err}`);
      return;
    }
    console.log(`stdout:${stdout}`);
    console.log(`stderr:${stderr}`);
    cb();
  });
}