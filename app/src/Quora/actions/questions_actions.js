import * as APIUtil from '../util/question_api_util';


/////////////////Questions//////////////////

export const RECEIVE_QUESTION = 'RECEIVE_QUESTION';
export const RECEIVE_ALL_QUESTIONS = 'RECEIVE_ALL_QUESTIONS';
export const REMOVE_QUESTION = 'REMOVE_QUESTION';


export const receiveQuestion = (question) => {
  return {
    type: RECEIVE_QUESTION,
    question
  };
};

export const receiveAllQuestions = (questions) => {
  return {
    type: RECEIVE_ALL_QUESTIONS,
    questions
  };
};

export const removeQuestion = (question) => {
  return {
    type: REMOVE_QUESTION,
    question
  };
};

export const fetchQuestion = (id) => dispatch => (
  APIUtil.fetchQuestion(id)
    .then(question => dispatch(receiveQuestion(question.data)))
);

export const fetchAllQuestions = () => dispatch => (
  APIUtil.fetchAllQuestions()
    .then(questions => dispatch(receiveAllQuestions(questions.data)))
);

export const createQuestion = (question) => dispatch => (
  APIUtil.createQuestion(question)
    .then(newQuestion => dispatch(receiveQuestion(newQuestion.data)))
);

export const updateQuestion = (question) => dispatch => (
  APIUtil.updateQuestion(question)
    .then(updatedQuestion => {
      dispatch(receiveQuestion(updatedQuestion.data));
    })
);


export const deleteQuestion = (id) => dispatch => (
  APIUtil.deleteQuestion(id)
    .then(question => dispatch(removeQuestion(question.data)))
);

/////////////////Answers//////////////////

export const RECEIVE_ANSWER = 'RECEIVE_ANSWER';
export const REMOVE_ANSWER = 'REMOVE_ANSWER';

export const receiveAnswer = (answer) => {
  return {
    type: RECEIVE_ANSWER,
    answer
  };
};

export const removeAnswer = (answer) => {
  return {
    type: REMOVE_ANSWER,
    answer
  };
};

export const createAnswer = (answer) => dispatch => (
  APIUtil.createAnswer(answer)
    .then(newAnswer => {
      var data = newAnswer.data;
      dispatch(receiveAnswer(data));
    })
);

export const updateAnswer = (answer) => dispatch => (
  APIUtil.updateAnswer(answer)
    .then(updatedAnswer => dispatch(receiveAnswer(newAnswer.data)))
);


export const deleteAnswer = (id) => dispatch => (
  APIUtil.deleteAnswer(id)
    .then(answer => dispatch(removeAnswer(answer.data)))
);

/////////////////Comments//////////////////

export const RECEIVE_COMMENT = 'RECEIVE_COMMENT';
export const REMOVE_COMMENT = 'REMOVE_COMMENT';


export const receiveComment = (comment) => {
  return {
    type: RECEIVE_COMMENT,
    comment
  };
};

export const removeComment = (comment) => {
  return {
    type: REMOVE_COMMENT,
    comment
  };
};


export const createComment = (comment) => dispatch => (
  APIUtil.addComment(comment)
    .then( newComment => dispatch(receiveComment(newComment.data)))
);

export const deleteComment = (id) => dispatch => (
  APIUtil.deleteComment(id)
    .then(comment => dispatch(removeComment(comment.data)))
);