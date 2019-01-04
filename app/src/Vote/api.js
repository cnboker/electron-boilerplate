import axios from 'axios'
var headers = require('../lib/check-auth').authHeader();

export const fetchVotes =(rootId)=>{
  return axios({
    method:'get',
    url:`${process.env.REACT_APP_API_URL}/votes/${rootId}`
  })
}

export const like =(id)=>{
  return axios({
    method:'post',
    url:`${process.env.REACT_APP_API_URL}/vote/create`,
    data:{object_id:id,like:1},
    headers
  })
}

export const dislike =(id)=>{
  return axios({
    method:'post',
    url:`${process.env.REACT_APP_API_URL}/vote/create`,
    data:{object_id:id,dislike:1},
    headers
  })
}