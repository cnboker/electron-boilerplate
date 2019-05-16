import {RECEIVE_TAGS,RECEIVE_TOPIC_CLOUD} from './actions';
import merge from 'lodash/merge';

const TagReducer = (state = {
  keyword: [],
  quora: [],
  quoraCloud:[]
}, action) => {
  Object.freeze(state);
  let newState = merge({}, state)
  switch (action.type) {
    case RECEIVE_TAGS:
      newState[action.payload.catelog] = action.payload.tags;
      //newState[action.payload.catelog].splice(0,0,'全部')
      return newState;
    case RECEIVE_TOPIC_CLOUD:
      newState.quoraCloud = action.payload;
      return newState;
    default:
      return state;
  }
};

export default TagReducer;