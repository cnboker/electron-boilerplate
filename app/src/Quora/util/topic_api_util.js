import axios from "axios";
var headers = require('../../lib/check-auth').authHeader();



export const fetchAllTopics = (searchTerm) => {
  return axios({
    method: 'GET',
    url: `${process.env.REACT_APP_API_URL}/topics`,
    data: {
      searchTerm: searchTerm
    }
  });
};

export const fetchTopicCloud = () => {
  return axios({method: 'GET', url: `${process.env.REACT_APP_API_URL}/topics/cloud`});
};

export const updateTopics = (data) => {
  return axios({method: 'post', url: `${process.env.REACT_APP_API_URL}/topic/update`, data, headers})
}

export const addFollow = (follow) => {
  return axios({method: 'POST', url: `${process.env.REACT_APP_API_URL}/follows`, data: follow, headers});
};

export const removeFollow = (id) => {
  return axios({method: 'DELETE', url: `${process.env.REACT_APP_API_URL}/follows/${id}`, headers});
};