import axios from 'axios'
import bows from 'bows'
import r from 'ramda'
import reduxCrud from 'redux-crud'
import {reducerKey} from './constants'

var baseActionCreators = reduxCrud.actionCreatorsFor(reducerKey)
var log = bows("keyword-actions")

let actionCreators = {
  fetch(page, limit, replaceExisting,client) {
    log("fetch to keyword")
    return function (dispatch, getState) {
        const action = baseActionCreators.fetchStart()
        log('action', action)
        dispatch(action)

        //const url = '/server'
        const url = `${process.env.REACT_APP_API_URL}api/keyword`
        
        const promise = axios(
          {
            url: url,
            method:'get',
            headers: {
             // Authorization: `bearer ${client.token.access_token}`
            }
          }
        )

        promise.then(function(response){
          log("fatch success", response)
          const returned = response.data
          const successAction = baseActionCreators.fetchSuccess(returned,{replace:replaceExisting});
          log("successAction",successAction);
          dispatch(successAction)
        },function(response){
          log("rejection",response);
          const errorAction = baseActionCreators.fetchError(response)
          dispatch(errorAction)
        }).catch(function(err){
          console.error(err.toString())
        })
    }
  },

  create(entity,client){
    return function(dispatch){
        //const cid = cuid()
        //svr = r.merge(svr,{id:cid})

        const optimisticAction = baseActionCreators.createStart(entity)
        dispatch(optimisticAction)

        //const url ="/server"
        const url = `${process.env.REACT_APP_API_URL}/api/keyword`
        
        const promise = axios({
          url : url,
          method:"post",
          data:entity,
          headers: {
           // Authorization: `bearer ${client.token.access_token}`
          }
        })

        promise.then(function(response){
            // dispatch the success action
            const returned = response.data
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
      const url = `${process.env.REACT_APP_API_URL}/api/keyword/${entity.id}`
      
      const promise = axios({
        url : url,
        method:"put",
        data : entity,
        headers: {
         // Authorization: `bearer ${client.token.access_token}`
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
      const url = `${process.env.REACT_APP_API_URL}/api/keyword/${entity.id}`
      
      const promise = axios({
        url:url,
        method:"delete",
        headers: {
          //Authorization: `bearer ${client.token.access_token}`
        }
      })

      promise.then(function(response){
          const optimisticAction = baseActionCreators.deleteSuccess(entity)
          dispatch(optimisticAction);
      },function(response){
          const errorAction = baseActionCreators.deleteError(response,entity)
          dispatch(errorAction)
      }).catch(function(err){
        console.error(err.toString())
      })

      return promise
    }
  },


}

actionCreators = r.merge(baseActionCreators,actionCreators)

export default actionCreators