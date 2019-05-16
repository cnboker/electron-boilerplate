import * as APIUtil from '../util/topic_api_util';
import {toast} from "react-toastify";

export const RECEIVE_FOLLOWED_TOPIC = 'RECEIVE_FOLLOWED_TOPIC';
export const REMOVE_FOLLOWED_TOPIC = 'REMOVE_FOLLOWED_TOPIC';

export const addFollow = (follow) => dispatch => (
  APIUtil.addFollow(follow)
    .then(newFollow => dispatch(receiveFollowedTopic(newFollow)))
);

export const removeFollow = (id) => dispatch => (
  APIUtil.removeFollow(id)
    .then(removedFollow => dispatch(removeFollowedTopic(removedFollow)))
);


export const receiveFollowedTopic = follow => {
  return ({
    type: RECEIVE_FOLLOWED_TOPIC,
    follow
  })
}

export const removeFollowedTopic = follow => {
  return ({
    type: REMOVE_FOLLOWED_TOPIC,
    follow
  })
}