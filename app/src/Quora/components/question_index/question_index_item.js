import React from 'react';
import {Link, withRouter} from 'react-router';

class QuestionIndexItem extends React.Component {

  constructor(props) {
    super(props);
    this.goToQuestion = this
      .goToQuestion
      .bind(this);
  }

  goToQuestion(e) {
    e.preventDefault();
    this
      .props
      .history
      .push(`/qa/${this.props.question._id}`);
  }

  render() {
    let question = this.props.question;
    return (
      <div
        className="media text-muted pt-3"
        onClick={this.goToQuestion}>
        <div className="question-topic">
          {question.bestTopic && <a href={`/#/topic/${question.bestTopic.id}`}>{question.bestTopic.name}</a>}
        </div>
        <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
        <div className="d-flex justify-content-between align-items-center w-100">
        <strong className="text-gray-dark">
            <a href={"/#/" + question.id}>{question.title}</a>
          </strong>
          <a href="#">关注</a>
        </div>
        <span className="d-block">@username</span>
        </div>
        {question.bestAnswer && <div className="best-answer">
          <div className="best-answer-header">
            {question.bestAnswer.author}
          </div>
          <div className="best-answer-content">
            {question.bestAnswer.content}
          </div>
          <div className="best-answer-footer"></div>
        </div>
      }
      </div>

    );
  }
}

export default withRouter(QuestionIndexItem);