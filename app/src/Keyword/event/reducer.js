import reduxCrud from 'redux-crud'
import bows from 'bows'
import {reducerKey} from './constants'

var baseReducers = reduxCrud.List.reducersFor('events', {key: '_id'})


var log = bows(`${reducerKey}-reducer`)

export default function reducer(state=[],action){
  log(action)

  switch(action.type){
    default:
    return baseReducers(state,action)
  }
}