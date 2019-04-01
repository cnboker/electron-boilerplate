import axios from "axios";

export const fetchAll = terms => {
  var headers = require("../lib/check-auth").authHeader();

  var query = Object.keys(terms)
    .map(key => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(terms[key]);
    })
    .join("&");
  return axios({
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/bill?${query}`,
    headers
  });
};

export const billPay = id => {
  var headers = require("../lib/check-auth").authHeader();

  return axios({
    method: "post",
    url: `${process.env.REACT_APP_API_URL}/billPay`,
    data: { id },
    headers
  });
};

export const wxqr = id => {
  var headers = require("../lib/check-auth").authHeader();

  return axios({
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/wxqr/${id}`,
    data: { id },
    headers
  });
};
