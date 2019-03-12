import axios from 'axios';
import AxiosMock from 'axios-mock-adapter';
import r from 'ramda';
import fixture  from './fixture'

var mock = new AxiosMock(axios,{delayResponse:500})

var nextMockId = 100

export default function init(){
  mock.onGet('/api/keyword').reply(200,fixture)

  mock.onPost('/api/keyword').reply(function(config){
    nextMockId++
    var record = JSON.parse(config.data)
    record = r.merge(record,{
      id:nextMockId
    })
    return [200,record]
  })

  mock.onPatch(/\/keyword\/d+/).reply(function(config){
    return [200,config.data]
  })

  mock.onDelete(/\/keyword\/\d+/).reply(200)
  
}