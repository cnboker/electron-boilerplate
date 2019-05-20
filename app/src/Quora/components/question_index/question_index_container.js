import {connect} from 'react-redux';
import {fetchQuestion, fetchAllQuestions, createQuestion, fetchQuesitonsByTopic} from '../../actions/questions_actions';
import {fetchQuoraCloud, fetchTags} from '../../../Tags/actions'
import QuestionIndex from './question_index';

const mapStateToProps = (state) => ({
  questions: Object
    .keys(state.questions)
    .map(key => state.questions[key]),
  client: state.client,
  quoraCloud: state.tagReducer['quoraCloud'],
  quoraTags: state.tagReducer['quora'],
  userProfile:state.userProfile
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch,
    fetchQuestion: id => dispatch(fetchQuestion(id)),
    fetchAllQuestions: () => dispatch(fetchAllQuestions()),
    fetchQuesitonsByTopic: (id) => dispatch(fetchQuesitonsByTopic(id)),
    createQuestion: (question) => dispatch(createQuestion(question)),
    // addFollow: (follow) => dispatch(addFollow(follow)), removeFollow: (id) =>
    // dispatch(removeFollow(id)),
    fetchQuoraCloud: () => dispatch(fetchQuoraCloud()),
    fetchTags: (catelog) => dispatch(fetchTags(catelog))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionIndex);