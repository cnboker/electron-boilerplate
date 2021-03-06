import axios from "axios";
import r from "ramda";
import reduxCrud from "redux-crud";
import { reducerKey } from "./constants";

var baseActionCreators = reduxCrud.actionCreatorsFor(reducerKey, {
  key: "_id"
});

let actionCreators = {
  fetch(page, limit, replaceExisting, client, _id) {
    return function(dispatch, getState) {
      const action = baseActionCreators.fetchStart();
      dispatch(action);

      var url = `${process.env.REACT_APP_API_URL}/event/${_id}`;

      const promise = axios({
        url: url,
        method: "get",
        headers: {
          Authorization: `Bearer ${client.access_token}`
        }
      });

      promise
        .then(
          function(response) {
            const returned = response.data;
            const successAction = baseActionCreators.fetchSuccess(returned, {
              replace: replaceExisting
            });
            dispatch(successAction);
          },
          function(response) {
            const errorAction = baseActionCreators.fetchError(response);
            dispatch(errorAction);
          }
        )
        .catch(function(err) {
          console.error(err.toString());
        });
    };
  },

  create(entity, client) {
    return function(dispatch) {
      entity = r.merge(entity, { _id: "" });

      const optimisticAction = baseActionCreators.createStart(entity);
      dispatch(optimisticAction);

      //const url ="/server"
      const url = `${process.env.REACT_APP_API_URL}/event/create`;

      const promise = axios({
        url: url,
        method: "post",
        data: entity,
        headers: {
          Authorization: `Bearer ${client.access_token}`
        }
      });
      return promise;
    };
  },

  update(entity, client) {
    return function(dispatch) {
      const optimisticAction = baseActionCreators.updateStart(entity);
      dispatch(optimisticAction);

      //const url = `/server/${entity.id}`
      const url = `${process.env.REACT_APP_API_URL}/event/${entity._id}`;
      console.log("url", url);
      const promise = axios({
        url: url,
        method: "put",
        data: entity,
        headers: {
          Authorization: `Bearer ${client.access_token}`
        }
      });

      promise
        .then(
          function(response) {
            const returned = response.data;
            const successAction = baseActionCreators.updateSuccess(returned);
            dispatch(successAction);
          },
          function(response) {
            const errorAction = baseActionCreators.updateError(
              response,
              entity
            );
            dispatch(errorAction);
          }
        )
        .catch(function(err) {
          console.error(err.toString());
        });
      return promise;
    };
  },

  delete(entity, client) {
    return function(dispatch) {
      const optimisticAction = baseActionCreators.deleteStart(entity);
      dispatch(optimisticAction);

      //const url = `/server/${svr.id}`;
      const url = `${process.env.REACT_APP_API_URL}/event/${entity._id}`;

      const promise = axios({
        url: url,
        method: "delete",
        headers: {
          Authorization: `Bearer ${client.access_token}`
        }
      });

      promise
        .then(
          function(response) {
            const optimisticAction = baseActionCreators.deleteSuccess(entity);
            dispatch(optimisticAction);
          },
          function(response) {
            const errorAction = baseActionCreators.deleteError(
              response,
              entity
            );
            dispatch(errorAction);
          }
        )
        .catch(function(err) {
          console.error(err.toString());
        });

      return promise;
    };
  }
};

actionCreators = r.merge(baseActionCreators, actionCreators);

export default actionCreators;
