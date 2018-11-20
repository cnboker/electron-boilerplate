var expect = require('chai').expect;
var password = '12345'

describe('passwordHash()',function(){
  it('should note equal',function(){
    var hash = require('../utils/passwordHash')(password)
    //console.log('hash',hash)
    //assert
    expect(hash.passwordHash).to.have.lengthOf(128)
  })
})