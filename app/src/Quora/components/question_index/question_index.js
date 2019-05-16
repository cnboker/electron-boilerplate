import React from 'react';
import {withRouter} from 'react-router';
import {Link} from "react-router-dom";
import QuestionIndexItem from './question_index_item';
import QueryBar from './query_bar';
import TopicSearchBar from './topic_search_bar';
import TopicCloud from '../../../Tags/tagCloud'

class QuestionIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTopicSearch: false
    };
    this.toggleTopicSearch = this
      .toggleTopicSearch
      .bind(this);
    this.unfollowTopic = this
      .unfollowTopic
      .bind(this);
  }

  componentDidMount() {
    this
      .props
      .fetchAllQuestions();
      this.props.fetchQuoraCloud();
      this.props.fetchTags('quora')

  }

  toggleTopicSearch() {
    this.setState({
      showTopicSearch: !this.state.showTopicSearch
    });
  }

  unfollowTopic(topic) {
    return e => {
      this
        .props
        .removeFollow(topic.id);
    }
  }

  render() {
    const questionIndexItems = this
      .props
      .questions
      .map(question => (<QuestionIndexItem
        key={question._id}
        question={question}
        fetchQuesitonsByTopic={this.props.fetchQuesitonsByTopic}
        updateQuestion={this.props.updateQuestion}/>));
    return (
      <React.Fragment>
        <QueryBar
          createQuestion={this.props.createQuestion}
          questions={this.props.questions}
          client={this.props.client} topics={this.props.quoraTags} history={this.props.history}/>
        <div className="row">
          <div className="col-md-3">
            <div className="left-sidebar">
              <div className="left-sidebar-header">
              {this.props.client.userName=='admin'&&<Link to={{pathname:"/tag/create",state:{catelog:'quora'}}} className="btn btn-outline-primary">编辑标签</Link>}
              </div>
             <TopicCloud tags={this.props.quoraCloud} fetchTopic={this.props.fetchQuesitonsByTopic}/>
              {this.state.showTopicSearch && <TopicSearchBar
                currentUser={this.props.currentUser}
                fetchAllTopics={this.props.fetchAllTopics}
                addFollow={this.props.addFollow}/>}
            </div>
          </div>
          <div className="col-md-9 my-3 p-3 bg-white rounded shadow-sm">
            <h6 className="border-bottom border-gray pb-2 mb-0">热榜</h6>
            
              {questionIndexItems}
           
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default QuestionIndex;