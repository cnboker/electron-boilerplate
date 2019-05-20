import React from 'react';
import {withRouter} from 'react-router';
import RichTextEditor from 'react-rte';
import {createAnswer} from '../../actions/questions_actions';

export default class AnswerForm extends React.Component {
  constructor(props) {
    super(props);
    const {question} = this.props.location.state;
    this.state = {
      content: RichTextEditor.createEmptyValue(),
      question_id: question._id
    };
    this.updateContent = this
      .updateContent
      .bind(this);
    this.answerQuestion = this
      .answerQuestion
      .bind(this);

  }

  answerQuestion(e) {
    e.preventDefault();
    const {createAnswer} = this.props;
    const {history} = this.props;
    var htmlEncode = require('js-htmlencode').htmlEncode;

    createAnswer({
      question_id: this.state.question_id,
      content: this
        .state
        .content
        .toString('html')
    }).then(() => {
      history.push(`/qa/${this.state.question_id}`)
    });
  }

  updateContent(value) {
    this.setState({["content"]: value});
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string. This is here
      // to demonstrate using `.toString()` but in a real app it would be better to
      // avoid generating a string on each change.
      this
        .props
        .onChange(value.toString('html'));
    }
  }

  render() {
    const {question} = this.props.location.state;
    return (
      <div className="row">

        <form
          style={{
          width: "100%"
        }}
          onSubmit={this.answerQuestion}>
          <div className="answer-form-header">
            <h1>{question.title}</h1>
            <h2>{question.description}</h2>
          </div>
          <RichTextEditor value={this.state.content} onChange={this.updateContent}/>
          <div className="mt-3">
            <input type="submit" className="btn btn-primary" value="提交"/>{" "}
            <input
              type="button"
              className="btn btn-secondary"
              value="取消"
              onClick={()=>this.props.history.goBack()}/>
          </div>

        </form>

      </div>
    );

  }
}

