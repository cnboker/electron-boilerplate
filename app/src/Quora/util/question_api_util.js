import axios from "axios";
var headers = require('../../lib/check-auth').authHeader();

export const fetchQuestion = (id) => {
  return axios({
    method: 'GET',
    url: `${process.env.REACT_APP_API_URL}/questions/${id}`
  });
};

export const fetchAllQuestions = () => {
  return axios({
    method: 'GET',
    url: `${process.env.REACT_APP_API_URL}/questions`
  });
};

export const fetchTopic = (id) => {
  return axios({
    method: 'GET',
    url: `${process.env.REACT_APP_API_URL}/questions?topic=${id}`
  });
};

export const createQuestion = (question) => {
  return axios({
    method: "post",
    url: `${process.env.REACT_APP_API_URL}/question/create`,
    data: question,
    headers
  })
};

export const updateQuestion = (question) => {
  return axios({
    method: 'put',
    url: `${process.env.REACT_APP_API_URL}/questions/${question.id}`,
    data: question,
    headers
  });
};


export const deleteQuestion = (id) => {
  return axios({
    method: 'DELETE',
    url: `${process.env.REACT_APP_API_URL}/questions/${id}`,
    headers
  });
};

///////////////Answers//////////////

export const createAnswer = (answer) => {
  return axios({
    method: 'POST',
    url: `${process.env.REACT_APP_API_URL}/answers`,
    data: answer,
    headers
  });
};

export const fetchAnswer = (id) => {
  return axios({
    method: 'GET',
    url: `${process.env.REACT_APP_API_URL}/answers/${id}`,
    headers
  });
};

export const deleteAnswer = (id) => {
  return axios({
    method: 'DELETE',
    url: `${process.env.REACT_APP_API_URL}/answers/${id}`,
    headers
  });
};

///////////////Comments///////////////

export const addComment = (comment) => {
  return axios({
    method: 'POST',
    url: `${process.env.REACT_APP_API_URL}/comments`,
    data: comment,
    headers
  });
};

export const deleteComment = (id) => {
  return axios({
    method: 'DELETE',
    url: `${process.env.REACT_APP_API_URL}/comments/${id}`,
    headers
  });
};