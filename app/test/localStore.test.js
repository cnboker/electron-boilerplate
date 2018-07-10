var expect = require('chai').expect;
var store = require('../tasks/localStore')
describe('localStore read write test',function(){
    it('write 2 item should retrun 2 item', (done)=>{
        store.setKeywordLocalStorage([{id:1, name:'scott'},{id:2,name:'hwx'}])
        var data = store.getKeywordLocalStorage()
        console.log(data)
        expect(2).to.equal(data.length)
        done();
    })

    it('remove id should return 1 item', (done)=>{
        store.setKeywordLocalStorage([{_id:1, name:'scott'},{_id:2,name:'hwx'}])
        store.removeItem(1)
        var data = store.getKeywordLocalStorage()
        expect(1).to.equal(data.length)
        done();
    })

    it('remove key should return undefined',(done)=>{
        store.setKeywordLocalStorage([{id:1, name:'scott'},{id:2,name:'hwx'}])
        store.del()
        expect(0).to.equal(store.getKeywordLocalStorage().length)
        done();
    })
})