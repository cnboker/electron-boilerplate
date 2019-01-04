import {RECEIVE_VOTE, RECEIVE_VOTES} from './actions'
import merge from 'lodash/merge'

const VoteReducer = (state = {}, action) => {
  Object.freeze(state)
  let newState = merge({}, state);

  switch (action.type) {
    case RECEIVE_VOTES:
      return action.votes;
    case RECEIVE_VOTE:
      newState[action.vote.object_id] = action.vote;
      return newState;
    default:
      return state;
  }
}

export default VoteReducer;