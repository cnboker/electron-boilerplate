import { connect } from 'react-redux';
import { fetchQuestion, fetchAllQuestions, createQuestion } from '../../actions/questions_actions';
//import { fetchTopicCloud as fetchTopic } from '../../actions/topic_actions';
import TopicShow from './topic_show';

const mapStateToProps = (state, ownProps) => {
  return {
    topic: state.topic
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchQuestion: id => dispatch(fetchQuestion(id)),
    fetchAllQuestions: () => dispatch(fetchAllQuestions()),
    fetchTopic: (id) => dispatch(fetchTopic(id)),
    createQuestion: (question) => dispatch(createQuestion(question)),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(TopicShow);