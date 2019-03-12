import axios from "axios";
var auth = require("~/src/lib/check-auth");
var headers = auth.authHeader();
var userName = auth.getUserName();
export const findAll = term => {
 
  var query = Object.keys(term)
    .map(key => {
      return (
        encodeURIComponent(key) + "=" + encodeURIComponent(term[key])
      );
    })
    .join("&");
  var url = `${process.env.REACT_APP_API_URL}/keywords?${query}`;

  console.log("actionCreators url", url);
  return axios({ url: url, method: "get", headers });
};

export const create = data => {
  const url = `${process.env.REACT_APP_API_URL}/keywords`;
  return axios({ url: url, method: "post", data, headers });
};

export const update = data => {
  const url = `${process.env.REACT_APP_API_URL}/keyword/${data._id}`;
  return axios({ url: url, method: "put", data, headers });
};

export const remove = id => {
  const url = `${process.env.REACT_APP_API_URL}/keyword/${id}`;
  return axios({ url: url, method: "delete", headers });
};

export const findWebsites = () => {
  return axios({
    url: `${process.env.REACT_APP_API_URL}/websiteOfkeywords`,
    method: "get",
    headers
  });
};

export const findToday = () => {
  return axios({
    url: `${process.env.REACT_APP_API_URL}/keywords/today`,
    method: "get",
    headers
  });
};
