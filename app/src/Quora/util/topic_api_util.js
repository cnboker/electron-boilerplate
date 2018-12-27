import axios from "axios";
var headers = require('../../lib/check-auth').authHeader();

export const fetchTopic = (id) => {
  return axios({
    method: 'GET',
    url: `${process.env.REACT_APP_API_URL}/topics/${id}`
  });
};

export const fetchAllTopics = (searchTerm) => {
  return axios({
    method: 'GET',
    url: `${process.env.REACT_APP_API_URL}/topics`,
    data: {searchTerm: searchTerm}
  });
};

export const addFollow = (follow) => {
  return axios({
    method: 'POST',
    url: `${process.env.REACT_APP_API_URL}/follows`,
    data: follow,
    headers
  });
};

export const removeFollow = (id) => {
  return axios({
    method: 'DELETE',
    url: `${process.env.REACT_APP_API_URL}/follows/${id}`,
    headers
  });
};