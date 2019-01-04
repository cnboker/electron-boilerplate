import {RECEIVE_QUESTION, RECEIVE_ALL_QUESTIONS, REMOVE_QUESTION, RECEIVE_ANSWER, REMOVE_ANSWER, RECEIVE_COMMENT,REMOVE_COMMENT} from '../actions/questions_actions';
import merge from 'lodash/merge';

const QuestionReducer = (state = {}, action) => {
  Object.freeze(state);
  let newState = merge({}, state);
  switch(action.type){
    case RECEIVE_QUESTION:
      return merge({}, state, {[action.question._id]: action.question});
    case RECEIVE_ALL_QUESTIONS:
      return action.questions;
    case REMOVE_QUESTION:
      delete newState[action.question._id];
      return newState;
    case RECEIVE_ANSWER:
      let answer = action.answer;
      (newState[answer.question_id].answers||{})[answer._id] = answer;
      return newState;
    case REMOVE_ANSWER:
      delete newState[action.answer.question_id].answers[action.answer._id];
      return newState;
    case RECEIVE_COMMENT:
      let comment = action.comment;
      if (comment.commentable_type === "Answer"){
        if(!newState[comment.question_id].answers[comment.commentable_id].comments){
          newState[comment.question_id].answers[comment.commentable_id].comments = {};
        }
        newState[comment.question_id].answers[comment.commentable_id].comments[comment._id] = comment;
      }
      return newState;
    case REMOVE_COMMENT:
      delete newState[action.comment.question_id].answers[action.comment.commentable_id].comments[action.comment._id];
      return newState;
    default:
      return state;
  }
};

export default QuestionReducer;