var expect = require('chai').expect;
var password = '12345'
var ph = require('../utils/passwordHash')

describe('passwordHash()',function(){
  it('should note equal',function(){
    ph.hash(password)
    //console.log('hash',hash)
    //assert
    //expect(ph.hash.passwordHash).to.have.lengthOf(128)
  })

  it('not duplicate strings', function(){
    var arr = []
    for(var i = 0; i < 1000; i++){
      arr.push(ph.radmon(6))
    }

    var newArray = arr.filter(function(item, pos) {
      return arr.indexOf(item) == pos && item.length > 3;
    });
    expect(arr.length).to.equal(newArray.length)
  })
})