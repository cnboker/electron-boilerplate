import {connect} from 'react-redux';
import {
  fetchQuestion,
  createQuestion,
  createAnswer,
  createComment,
  deleteQuestion,
  deleteAnswer,
  deleteComment
} from '../../actions/questions_actions';
import {fetchVotes, like, dislike} from '../../../Vote/actions'
import QuestionShow from './question_show';

const mapStateToProps = (state, ownProps) => {
  return ({
    currentUser: state.client.token,
    question: state.questions[ownProps.match.params.id],
    votes: state.votes
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchQuestion: id => dispatch(fetchQuestion(id)),
    createQuestion: question => dispatch(createQuestion(question)),
    deleteQuestion: id => dispatch(deleteQuestion(id)),
    deleteAnswer: id => dispatch(deleteAnswer(id)),
    deleteComment: id => dispatch(deleteComment(id)),
    createAnswer: answer => dispatch(createAnswer(answer)),
    createComment: comment => dispatch(createComment(comment)),
    like: id => dispatch(like(id)),
    dislike: id => dispatch(dislike(id)),
    fetchVotes: (id) => dispatch(fetchVotes(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionShow);