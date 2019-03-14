import * as api from "../apis/keyword_api";
import {toast} from "react-toastify";
import resources from "~/src/locale";

export const RECEIVE_ALL_KEYWORDS = "RECEIVE_ALL_KEYWORDS";
export const RECEIVE_KEYWORD = "RECEIVE_KEYWORD";
export const REMOVE_KEYWORD = "REMOVE_KEYWORD";
export const RECEIVE_WEBSITES = "RECEIVE_WEBSITES";

export const receiveWebistes = payload => {
  return {type: RECEIVE_WEBSITES, payload};
};
export const receiveAll = keywords => {
  return {type: RECEIVE_ALL_KEYWORDS, keywords};
};

export const removeKeyword = ids => {
  return {type: REMOVE_KEYWORD, ids};
};

export const receiveKeyword = keyword => {
  return {type: RECEIVE_KEYWORD, keyword};
};

export const findWebsites = () => dispatch => {
  api
    .findWebsites()
    .then(response => {
      dispatch(receiveWebistes(response.data));
    });
};
export const findAllKeywords = queryTerms => dispatch => {
  api
    .findAll(queryTerms || {})
    .then(response => {
      dispatch(receiveAll(response.data));
    });
};

export const findToday = () => dispatch => {
  api
    .findToday()
    .then(response => {
      dispatch(receiveAll(response.data));
    });
};

export const createKeyword = keyword => dispatch => {
  api
    .create(keyword)
    .then(response => {
      toast.success(resources.fetch_data_ok, {position: toast.POSITION.BOTTOM_CENTER});
      dispatch(receiveKeyword(response.data));

      var ipc = require('~/ipc/ipcBus')
      //var ipcBridge = require('./ipcBridge')
      var keywords = response.data;
      for (let doc of keywords) {
        ipc
          .frontToBack('keyword_create', doc)
          .then(result => {
            dispatch(receiveKeyword(result))
          })
      }
    })
    .catch(e => {
      if (e.response) {
        toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_CENTER});
      } else {
        toast.error(e.message, {position: toast.POSITION.BOTTOM_CENTER});
      }
    });
};

export const updateKeyword = keyword => dispatch => {
  api
    .update(keyword)
    .then(response => {
      toast.success(resources.fetch_data_ok, {position: toast.POSITION.BOTTOM_CENTER});
      dispatch(receiveKeyword(response.data));
      if (keyword.action === 'reset') {
        var ipc = require('~/ipc/ipcBus')
        ipc
          .frontToBack('keyword_create', response.data)
          .then(result => {
            dispatch(receiveKeyword(result))
          })
      }
    })
    .catch(e => {
      if (e.response) {
        toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_CENTER});
      } else {
        toast.error(e.message, {position: toast.POSITION.BOTTOM_CENTER});
      }
    });
};

export const deleteKeyword = ids => dispatch => {
  api
    .remove(ids)
    .then(keyword => {
      dispatch(removeKeyword(ids));
    });
};
