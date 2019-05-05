import reduxCrud from 'redux-crud'
import {reducerKey} from './constants'

var baseReducers = reduxCrud.List.reducersFor('users', {key: '_id'})

export default function reducer(state=[],action){

  switch(action.type){
    default:
    return baseReducers(state,action)
  }
}