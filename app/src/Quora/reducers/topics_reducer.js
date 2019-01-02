import {RECEIVE_TOPIC, RECEIVE_ALL_TOPICS, RECEIVE_TOPIC_CLOUD} from '../actions/topic_actions';
import merge from 'lodash/merge';

const TopicReducer = (state = {
  cloud: [],
  all: []
}, action) => {
  Object.freeze(state);
  let newState = merge({}, state)
  switch (action.type) {
    case RECEIVE_TOPIC:
      //newState.all = action.topic;
      return newState;
    case RECEIVE_ALL_TOPICS:
      newState.all = action.topics;
      return newState;
    case RECEIVE_TOPIC_CLOUD:
      newState.cloud = action.topics;
      return newState;
    default:
      return state;
  }
};

export default TopicReducer;