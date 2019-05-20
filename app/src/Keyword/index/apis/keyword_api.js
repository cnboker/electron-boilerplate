import axios from "axios";
var auth = require("~/src/lib/check-auth");

export const findAll = term => {
  var headers = auth.authHeader();

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
  var headers = auth.authHeader();

  const url = `${process.env.REACT_APP_API_URL}/keywords`;
  return axios({ url: url, method: "post", data, headers });
};

export const update = data => {
  var headers = auth.authHeader();

  const url = `${process.env.REACT_APP_API_URL}/keyword/${data._id}`;
  return axios({ url: url, method: "put", data, headers });
};

export const remove = ids => {
  var headers = auth.authHeader();

  const url = `${process.env.REACT_APP_API_URL}/keyword`;
  return axios({ url: url, method: "delete", data:{ids}, headers });
};


export const keywordsTagUpdate = (ids,tags) => {
  var headers = auth.authHeader();
  if(tags.length == 0)return;
  if(ids.length == 0)return;
  const url = `${process.env.REACT_APP_API_URL}/keywords/tagUpdate`;
  return axios({ url: url, method: "put", data:{id:ids,tags}, headers });
};

export const findWebsites = () => {
  var headers = auth.authHeader();

  return axios({
    url: `${process.env.REACT_APP_API_URL}/websiteOfkeywords`,
    method: "get",
    headers
  });
};

export const findToday = () => {
  var headers = auth.authHeader();

  return axios({
    url: `${process.env.REACT_APP_API_URL}/keywords/today`,
    method: "get",
    headers
  });
};
