import axios from "axios";

export const addFollow = (follow) => {
  var headers = require('../../lib/check-auth').authHeader();
  return axios({method: 'POST', url: `${process.env.REACT_APP_API_URL}/follows`, data: follow, headers});
};

export const removeFollow = (id) => {
  var headers = require('../../lib/check-auth').authHeader();
  return axios({method: 'DELETE', url: `${process.env.REACT_APP_API_URL}/follows/${id}`, headers});
};