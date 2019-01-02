import React from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment'
class QuestionIndexItem extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let question = this.props.question;
    return (
      <div className="media text-muted pt-3" >
        <div className="question-topic">
          {question.bestTopic && <a href={`/#/topic/${question.bestTopic.id}`}>{question.bestTopic.name}</a>}
        </div>
        <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
          <div className="d-flex justify-content-between align-items-center w-100">
            <strong
              className="text-gray-dark"
              style={{
              fontSize: "15pt"
            }}>
              <Link to={`/qa/${this.props.question._id}`}>{question.title}</Link>
            </strong>
            <a href="#">
              <i className="icon-speech"></i>{" "}
              {question.answerCount}</a>
          </div>
          <div >
            {question.topics&&question.topics.map(x=><span key={x} onClick={()=>this.props.fetchTopic(x)} className="badge badge-pill badge-primary">{x}</span>)}
        </div>
          <span className="d-block">{moment(question.create_at).format("YYYY-MM-DD")}@{question.author}</span>
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

export default QuestionIndexItem