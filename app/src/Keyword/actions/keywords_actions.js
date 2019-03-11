import * as api from '../apis/keyword_api'

export const RECEIVE_ALL_KEYWORDS = 'RECEIVE_ALL_KEYWORDS'
export const RECEIVE_KEYWORD = 'RECEIVE_KEYWORD'
export const REMOVE_KEYWORD = 'REMOVE_KEYWORD'
export const RECEIVE_WEBSITES = 'RECEIVE_WEBSITES'

export const receiveWebistes = (payload) => {
  return {type: RECEIVE_WEBSITES, payload}
}
export const receiveAll = keywords => {
  return {type: RECEIVE_ALL_KEYWORDS, keywords}
}

export const removeKeyword = ids => {
  return {type: REMOVE_KEYWORD, ids}
}


export const receiveKeyword = keyword => {
  return {type: RECEIVE_KEYWORD, keyword}
}

export const findWebsites = () => dispatch => {
  api
    .findWebsites()
    .then(response => {
      dispatch(receiveWebistes(response.data))
    })
}
export const findAllKeywords = (queryTerms) => dispatch => {
  api
    .findAll(queryTerms||{})
    .then(response => {
      dispatch(receiveAll(response.data))
    })
}

export const createKeyword = (keyword) => dispatch => {
  api
    .create(keyword)
    .then(response => {
      dispatch(receiveKeyword(response.data))
    })
}

export const updateKeyword = (keyword) => dispatch => {
  api
    .update(keyword)
    .then(response => {
      dispatch(receiveKeyword(response.data))
    })
}

export const deleteKeyword = (ids) => dispatch => {
  api
    .remove(ids)
    .then(keyword => {
      dispatch(removeKeyword(ids))
    })
}


