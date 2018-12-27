import React from 'react';
import {Link, withRouter} from 'react-router';
import QuestionIndexItem from './question_index_item';
import QueryBar from './query_bar';
import TopicSearchBar from './topic_search_bar';

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
        key={question.id}
        question={question}
        updateQuestion={this.props.updateQuestion}/>));
    return (
      <div className="">
        <QueryBar
          createQuestion={this.props.createQuestion}
          questions={this.props.questions}
          client={this.props.client}/>
        <div className="row">
          <div className="col-md-3">
            <div className="left-sidebar">
              <div className="left-sidebar-header">
                <h2>Feeds</h2>
                <a onClick={this.toggleTopicSearch}>
                  {!this.state.showTopicSearch && "Edit"}
                  {this.state.showTopicSearch && "Done"}
                </a>

              </div>
              <ul className="topics-list">
                <li>Top Stories</li>
                {this.props.currentUser && Object
                  .keys(this.props.currentUser.topics)
                  .map(key => <li key={key}>
                    <Link to={`/topic/${key}`}>{this.props.currentUser.topics[key].name}</Link>
                    {this.state.showTopicSearch && <div
                      className="unfollow-button"
                      onClick={this.unfollowTopic(this.props.currentUser.topics[key])}>X</div>
}
                  </li>)}
              </ul>
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
      </div>
    );
  }
}

export default withRouter(QuestionIndex);