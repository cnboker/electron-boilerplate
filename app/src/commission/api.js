import axios from 'axios'
var headers = require('../lib/check-auth').authHeader();

export const fetchAll =(terms)=>{
  var query = Object
  .keys(terms)
  .map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(terms[key])
  })
  .join('&')
  return axios({
    method:'get',
    url:`${process.env.REACT_APP_API_URL}/commissions?${query}`,
    headers
  })
}

export const commissionPay =(id)=>{
  return axios({
    method:'post',
    url:`${process.env.REACT_APP_API_URL}/commissionPay`,
    data:{id},
    headers
  })
}