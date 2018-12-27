import React from 'react';
import Answer from './answer';

class AnswerList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let answers = Object.keys(this.props.question.answers);
    return (

      <div >
        <p>
          {parseInt(answers.length) + " 个回答"}
        </p>
        <div className="row">
          {answers.map(key => <Answer
            key={key}
            question={this.props.question}
            answer={this.props.question.answers[key]}
            currentUser={this.props.currentUser}
            createComment={this.props.createComment}
            deleteAnswer={this.props.deleteAnswer}
            deleteComment={this.props.createComment}
            receiveAnswer={this.props.receiveAnswer}/>)}
        </div>
      </div>
    );
  }
}

export default AnswerList;