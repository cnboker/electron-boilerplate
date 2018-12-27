import { connect } from 'react-redux';
import { fetchQuestion, fetchAllQuestions, createQuestion } from '../../actions/questions_actions';
import { fetchAllTopics, addFollow, removeFollow} from '../../actions/topic_actions'
import QuestionIndex from './question_index';

const mapStateToProps = (state) => ({
  questions: Object.keys(state.questions).map(key => state.questions[key]),
});

const mapDispatchToProps = (dispatch,ownProps) => {
  return {
    fetchQuestion: id => dispatch(fetchQuestion(id)),
    fetchAllQuestions: () => dispatch(fetchAllQuestions()),
    fetchTopic: (id) => dispatch(fetchQuestion(id)),
    fetchAllTopics: (searchTerm) => dispatch(fetchAllTopics(searchTerm)),
    createQuestion: (question) => dispatch(createQuestion(question)),
    addFollow: (follow) => dispatch(addFollow(follow)),
    removeFollow: (id) => dispatch(removeFollow(id))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(QuestionIndex);