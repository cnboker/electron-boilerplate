import axios from 'axios'
import r from 'ramda'
import reduxCrud from 'redux-crud'
import {reducerKey} from './constants'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import {sendToBackground} from "../communication";
var baseActionCreators = reduxCrud.actionCreatorsFor(reducerKey, {key: '_id'})

let actionCreators = {
  today(page, limit, replaceExisting,client) {
    return function (dispatch, getState) {
        const action = baseActionCreators.fetchStart()
        dispatch(action)

        var url = `${process.env.REACT_APP_API_URL}/keywords/today`
        dispatch(showLoading())
        console.log('actionCreators url',url);
        const promise = axios(
          {
            url: url,
            method:'get',
            headers: {
             Authorization: `Bearer ${client.token.access_token}`
            }
          }
        )

        promise.then(function(response){
          const returned = response.data
          const successAction = baseActionCreators.fetchSuccess(returned,{replace:replaceExisting});
          dispatch(successAction)
          dispatch(hideLoading())
        },function(response){
          const errorAction = baseActionCreators.fetchError(response)
          dispatch(errorAction)
          dispatch(hideLoading())
        }).catch(function(err){
          console.error(err.toString())
        })
    }
  },
  fetch(page, limit, replaceExisting,client, userName) {
    return function (dispatch, getState) {
        const action = baseActionCreators.fetchStart()
        dispatch(action)
        dispatch(showLoading())
        var url = `${process.env.REACT_APP_API_URL}/keywords?userName=${userName||''}`
       
        console.log('actionCreators url',url);
        const promise = axios(
          {
            url: url,
            method:'get',
            headers: {
             Authorization: `Bearer ${client.token.access_token}`
            }
          }
        )

        promise.then(function(response){
          const returned = response.data
          const successAction = baseActionCreators.fetchSuccess(returned,{replace:replaceExisting});
          dispatch(successAction)
          dispatch(hideLoading())
        },function(response){
          const errorAction = baseActionCreators.fetchError(response)
          dispatch(errorAction)
          dispatch(hideLoading())
        }).catch(function(err){
          console.error(err.toString())
        })
    }
  },

  create(entity,client){
    return function(dispatch){
        //const cid = cuid()
        entity = r.merge(entity,{_id:''})

        const optimisticAction = baseActionCreators.createStart(entity)
        dispatch(optimisticAction)
        //const url ="/server"
        const url = `${process.env.REACT_APP_API_URL}/keywords`
        
        const promise = axios({
          url : url,
          method:"post",
          data:entity,
          headers: {
            Authorization: `Bearer ${client.token.access_token}`
          }
        })

        promise.then(function(response){
            // dispatch the success action
            const returned = response.data
            //发消息给后台
            sendToBackground('keyword_create',returned)
            const successAction = baseActionCreators.createSuccess(returned)
            dispatch(successAction)
        },function(response){
            const errorAction = baseActionCreators.createError(response,entity)
            dispatch(errorAction)
        }).catch(function(err){
           console.error(err.toString())
        })

        return promise

    }
  },

  
  update(entity,client){
    return function(dispatch){
      const optimisticAction = baseActionCreators.updateStart(entity)
      dispatch(optimisticAction)

      //const url = `/server/${entity.id}`
      const url = `${process.env.REACT_APP_API_URL}/keyword/${entity._id}`
      console.log('url', url)
      const promise = axios({
        url : url,
        method:"put",
        data : entity,
        headers: {
          Authorization: `Bearer ${client.token.access_token}`
        }
      })

      promise.then(function(response){
        const returned = response.data;
        const successAction = baseActionCreators.updateSuccess(returned);
        dispatch(successAction);
      },function(response){
        const errorAction = baseActionCreators.updateError(response,entity);
        dispatch(errorAction)
      }).catch(function(err){
        console.error(err.toString())
      })
      return promise
    }
  },

  delete(entity,client){
    return function(dispatch){
      const optimisticAction = baseActionCreators.deleteStart(entity);
      dispatch(optimisticAction);

      //const url = `/server/${svr.id}`;
      const url = `${process.env.REACT_APP_API_URL}/keyword/${entity._id}`
      dispatch(showLoading())
      const promise = axios({
        url:url,
        method:"delete",
        headers: {
          Authorization: `Bearer ${client.token.access_token}`
        }
      })

      promise.then(function(response){
          const optimisticAction = baseActionCreators.deleteSuccess(entity)
          dispatch(optimisticAction);
          dispatch(hideLoading())
      },function(response){
          const errorAction = baseActionCreators.deleteError(response,entity)
          dispatch(errorAction)
          dispatch(hideLoading())
      }).catch(function(err){
        console.error(err.toString())
      })

      return promise
    }
  },


}

actionCreators = r.merge(baseActionCreators,actionCreators)

export default actionCreators