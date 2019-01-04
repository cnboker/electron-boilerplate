import React from 'react';
import {Link, withRouter} from 'react-router';
import QueryBar from '../question_index/query_bar';
import AnswerList from './answer_list';
import Answer from './answer';
import AnswerForm from './answer_form';

class QuestionShow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showAnswerForm: false
    };
    this.toggleAnswerForm = this
      .toggleAnswerForm
      .bind(this);
    this.deleteQuestion = this
      .deleteQuestion
      .bind(this);
  }

  componentDidMount() {
    this
      .props
      .fetchQuestion(this.props.match.params.id);
    this
      .props
      .fetchVotes(this.props.question._id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this
        .props
        .fetchQuestion(nextProps.params.id);
    }
  }

  routeIsCorrect() {
    return parseInt(this.props.match.params.id) === this.props.question.id;
  }

  toggleAnswerForm() {
    this.setState({
      showAnswerForm: !this.state.showAnswerForm
    });
  }

  deleteQuestion() {
    if (this.props.question.author === this.props.currentUser.userName) {
      this
        .props
        .deleteQuestion(this.props.question._id);
      this
        .props
        .history
        .push('/qa')

    }
  }

  render() {
    let answerform = <div className="answer-form-container">
      <AnswerForm
        question={this.props.question}
        currentUser={this.props.currentUser}
        createAnswer={this.props.createAnswer}
        updateQuestion={this.props.updateQuestion}
        toggleAnswerForm={this.toggleAnswerForm}/>
    </div>;
    return (

      <div className="question-page">
        {this.state.showAnswerForm && answerform}
        <QueryBar createQuestion={this.props.createQuestion}/>

        <p>
          {this.props.question.topics && this
            .props
            .question
            .topics
            .map((key) => <span key={key} className="badge badge-primary badge-pill">
              {key}
            </span>)
}
        </p>
        <h3>{this.props.question.title}</h3>
        <h2>{this.props.question.description}</h2>
        <p className="lead">
          <button
            className="btn btn-primary"
            type="button"
            onClick={this.toggleAnswerForm}>回答</button>{" "} {this.props.question.author === this.props.currentUser.userName &&< button className = "btn btn-danger" type = "button" onClick = {
            this.deleteQuestion
          } > 删除 < /button>}
        </p>

        <hr/> {this.props.question.answers && <AnswerList
          question={this.props.question}
          currentUser={this.props.currentUser}
          createAnswer={this.props.createAnswer}
          createComment={this.props.createComment}
          deleteAnswer={this.props.deleteAnswer}
          deleteComment={this.props.deleteComment}
          toggleAnswerForm={this.toggleAnswerForm}
          votes={this.props.votes}
          like={this.props.like}
          dislike={this.props.dislike}/>
}

      </div>
    )
  }
}

export default QuestionShow;