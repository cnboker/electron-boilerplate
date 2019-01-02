import * as APIUtil from '../util/topic_api_util';
import {toast} from "react-toastify";

export const RECEIVE_TOPIC = 'RECEIVE_TOPIC';
export const RECEIVE_ALL_TOPICS = 'RECEIVE_ALL_TOPICS';
export const RECEIVE_FOLLOWED_TOPIC = 'RECEIVE_FOLLOWED_TOPIC';
export const REMOVE_FOLLOWED_TOPIC = 'REMOVE_FOLLOWED_TOPIC';
export const RECEIVE_TOPIC_CLOUD = 'RECEIVE_TOPIC_CLOUD'



export const fetchAllTopics = (searchTerm) => dispatch => (
  APIUtil.fetchAllTopics(searchTerm)
    .then(topics => dispatch(receiveAllTopics(topics.data)))
)

export const updateTopics = (data)=>dispatch=>{
  APIUtil.updateTopics(data)
  .then(()=>{
    toast.info("操作成功", {position: toast.POSITION.BOTTOM_CENTER});

  }).catch(e=>{
    toast.error(e.message, {position: toast.POSITION.BOTTOM_CENTER});
  })
}

export const fetchTopicCloud =()=>dispatch=>{
  APIUtil.fetchTopicCloud().then(topics=>dispatch(receiveTopicCloud(topics.data)))
}

export const addFollow = (follow) => dispatch => (
  APIUtil.addFollow(follow)
    .then(newFollow => dispatch(receiveFollowedTopic(newFollow)))
);

export const removeFollow = (id) => dispatch => (
  APIUtil.removeFollow(id)
    .then(removedFollow => dispatch(removeFollowedTopic(removedFollow)))
);



export const receiveTopic = topic => {
  return ({
    type: RECEIVE_TOPIC,
    topic
  });
};

export const receiveAllTopics = topics => {
  return ({
    type: RECEIVE_ALL_TOPICS,
    topics
  });
};

export const receiveTopicCloud = topics=>{
  return ({
    type:RECEIVE_TOPIC_CLOUD,
    topics
  })
}

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