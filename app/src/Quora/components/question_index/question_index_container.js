import { connect } from 'react-redux';
import { fetchQuestion, fetchAllQuestions, createQuestion ,fetchTopic} from '../../actions/questions_actions';
import { fetchAllTopics, addFollow, removeFollow,fetchTopicCloud} from '../../actions/topic_actions'
import QuestionIndex from './question_index';

const mapStateToProps = (state) => ({
  questions: Object.keys(state.questions).map(key => state.questions[key]),
  client:state.client.token,
  topicCloud:state.topic.cloud,
  topics:state.topic.all
});

const mapDispatchToProps = (dispatch,ownProps) => {
  return {
    fetchQuestion: id => dispatch(fetchQuestion(id)),
    fetchAllQuestions: () => dispatch(fetchAllQuestions()),
    fetchTopic: (id) => dispatch(fetchTopic(id)),
    fetchAllTopics: (searchTerm) => dispatch(fetchAllTopics(searchTerm)),
    createQuestion: (question) => dispatch(createQuestion(question)),
    addFollow: (follow) => dispatch(addFollow(follow)),
    removeFollow: (id) => dispatch(removeFollow(id)),
    fetchTopicCloud:()=>dispatch(fetchTopicCloud())
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(QuestionIndex);