process.env.NODE_ENV = 'test'

let mongoose = require('mongoose')
let Keyword = require('../api/Keyword/Model')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should();

chai.use(chaiHttp)

describe("Keyword",()=>{
    
});