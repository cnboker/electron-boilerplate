import {toast} from "react-toastify";
import axios from 'axios'
export const RECEIVE_TAGS = 'RECEIVE_TAGS';

export const RECEIVE_TOPIC_CLOUD = 'RECEIVE_TOPIC_CLOUD'

export const receiveTopicCloud = payload => {
  return ({type: RECEIVE_TOPIC_CLOUD, payload})
}
export const fetchQuoraCloud = () => dispatch => {
  var headers = require('../lib/check-auth').authHeader();
  axios({method: 'GET', url: `${process.env.REACT_APP_API_URL}/topics/cloud`, headers}).then(topics => dispatch(receiveTopicCloud(topics.data)))
}

export const fetchTags = (catelog) => dispatch => {
  var headers = require('../lib/check-auth').authHeader();
  axios({method: 'GET', url: `${process.env.REACT_APP_API_URL}/topics/${catelog}`, headers}).then(response => {
    var data = {
      catelog,
      tags: response.data
    };
    dispatch(receiveTags(data))
  })
}

export const tagUpdate = (data) => dispatch => {
  var headers = require('../lib/check-auth').authHeader();
  axios({method: 'post', url: `${process.env.REACT_APP_API_URL}/topic/update`, data, headers}).then(() => {
    toast.info("操作成功", {position: toast.POSITION.BOTTOM_CENTER});
  }).catch(e => {
    toast.error(e.message, {position: toast.POSITION.BOTTOM_CENTER});
  })
}

// export const fetchQuoraCloud = () => dispatch => {
//   var headers = require('../lib/check-auth').authHeader();
//   axios({method: 'GET', url: `${process.env.REACT_APP_API_URL}/topics/quora`, headers}).then(topics => {
//     var data = {
//       catelog: 'quora',
//       tags: topics.data
//     };
//     dispatch(receiveTags(data))
//   })
// }

export const receiveTags = payload => {
  return ({type: RECEIVE_TAGS, payload});
};

export const tagSelect = (catelog, tagName) => {
  var data = {
    catelog,
    tagName
  };
  var headers = require('../lib/check-auth').authHeader();
  axios({
    method: 'GET',
    url: `${process.env.REACT_APP_API_URL}/tag/filter`
  }, data, headers).then(topics => {
    //dispatch(receiveTags(data))
  })
}