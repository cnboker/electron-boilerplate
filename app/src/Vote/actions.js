import {dispatch} from 'rxjs/internal/observable/range';

var api = require('./api')

export const RECEIVE_VOTES = 'RECEIVE_VOTES'
export const RECEIVE_VOTE = 'RECEIVE_VOTE'

export const receiveVotes = (votes) => {
  return {type: RECEIVE_VOTES, votes}
}

export const receiveVote = (vote) => {
  return {type: RECEIVE_VOTE, vote}
}

export const fetchVotes = (rootId) => dispatch => {
  api
    .fetchVotes(rootId)
    .then(res => {
      dispatch(receiveVotes(res.data))
    })
}

export const like = (id) => dispatch => {
  api
    .like(id)
    .then(res => {
      dispatch(receiveVote(res.data))
    })
}

export const dislike = (id) => dispatch => {
  api
    .dislike(id)
    .then(res => {
      dispatch(receiveVote(res.data))
    })
}