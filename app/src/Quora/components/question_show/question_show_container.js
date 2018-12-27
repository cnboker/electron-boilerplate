import {connect} from 'react-redux';
import {
  fetchQuestion,
  createQuestion,
  createAnswer,
  createComment,
  deleteQuestion,
  deleteAnswer
} from '../../actions/questions_actions';
import QuestionShow from './question_show';

const mapStateToProps = (state, ownProps) => {
  return ({
    currentUser:state.client.token,
    question: state
      .questions[ownProps.match.params.id]
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchQuestion: id => dispatch(fetchQuestion(id)),
    createQuestion: question => dispatch(createQuestion(question)),
    deleteQuestion: id => dispatch(deleteQuestion(id)),
    deleteAnswer: id => dispatch(deleteAnswer(id)),
    deleteComent: id => dispatch(deleteComment(id)),
    createAnswer: answer => dispatch(createAnswer(answer)),
    createComment: comment => dispatch(createComment(comment))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionShow);