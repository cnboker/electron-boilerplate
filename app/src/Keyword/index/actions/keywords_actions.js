import * as api from "../apis/keyword_api";
import { toast } from "react-toastify";
import resources from "~/src/locale";
import { customSplit } from "~/src/utils/string";

export const RECEIVE_ALL_KEYWORDS = "RECEIVE_ALL_KEYWORDS";
export const RECEIVE_KEYWORD = "RECEIVE_KEYWORD";
export const REMOVE_KEYWORD = "REMOVE_KEYWORD";
export const RECEIVE_WEBSITES = "RECEIVE_WEBSITES";

export const receiveWebistes = payload => {
  return { type: RECEIVE_WEBSITES, payload };
};
export const receiveAll = keywords => {
  return { type: RECEIVE_ALL_KEYWORDS, keywords };
};

export const removeKeyword = ids => {
  return { type: REMOVE_KEYWORD, ids };
};

export const receiveKeyword = keyword => {
  return { type: RECEIVE_KEYWORD, keyword };
};

export const findWebsites = () => dispatch => {
  api.findWebsites().then(response => {
    dispatch(receiveWebistes(response.data));
  });
};
export const findAllKeywords = queryTerms => dispatch => {
  api.findAll(queryTerms || {}).then(response => {
    var docs = response.data.reduce((map, doc) => {
      map[doc._id] = doc;
      return map;
    }, {});
    dispatch(receiveAll(docs));
  });
};

export const findToday = () => dispatch => {
  api.findToday().then(response => {
    dispatch(receiveAll(response.data));
  });
};

export const createKeyword = keyword => dispatch => {
  var arr = customSplit(keyword.keyword);
  if (arr.length > 30) {
    toast.error('一次新增关键字不能超过30个', { position: toast.POSITION.BOTTOM_CENTER });
    return;
  }
  api
    .create(keyword)
    .then(response => {
      toast.success(resources.fetch_data_ok, {
        position: toast.POSITION.BOTTOM_CENTER
      });
      dispatch(receiveKeyword(response.data));

      var ipc = require("~/ipc/ipcBus");
      var keywords = response.data;
      for (let doc of keywords) {
        ipc.sendToBackground("keyword_create", doc);
      }
    })
    .catch(e => {
      if (e.response) {
        toast.error(e.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      } else {
        toast.error(e.message, { position: toast.POSITION.BOTTOM_CENTER });
      }
    });
};

export const updateKeyword = keyword => dispatch => {
  api
    .update(keyword)
    .then(response => {      
      dispatch(receiveKeyword(response.data));
      if (keyword.action === "reset") {
        var ipc = require("~/ipc/ipcBus");
        ipc.sendToBackground("keyword_create", response.data);
      }
    })
    .catch(e => {
      if (e.response) {
        toast.error(e.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      } else {
        toast.error(e.message, { position: toast.POSITION.BOTTOM_CENTER });
      }
    });
};

export const deleteKeyword = ids => dispatch => {
  api.remove(ids).then(keyword => {
    dispatch(removeKeyword(ids));
  });
};
