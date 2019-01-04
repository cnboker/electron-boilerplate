import React from 'react';
import {withRouter} from 'react-router';
import RichTextEditor from 'react-rte';

class AnswerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: RichTextEditor.createEmptyValue(),
      question_id: this.props.question._id
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
    var htmlEncode = require('js-htmlencode').htmlEncode;

    this
      .props
      .createAnswer({
        question_id:this.state.question_id,
        content:this.state.content.toString('html')
      })
      .then(this.props.toggleAnswerForm);
  }

  updateContent(value) {
   
    this.setState({["content"]: value});
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange(
        value.toString('html')
      );
    }
  }

  render() {
    const question = this.props.question;
    return (
      <form className="answer-form" onSubmit={this.answerQuestion}>
        <div className="answer-form-header">
          <h1>{question.title}</h1>
          <h2>{question.description}</h2>
        </div>
        <RichTextEditor value={this.state.content}
        onChange={this.updateContent}
      />
        <br/>
        <p>
          <input type="submit" className="btn btn-primary" value="提交"/>{" "}
          <input
            type="button"
            className="btn btn-secondary"
            value="取消"
            onClick={this.props.toggleAnswerForm}/>
        </p>

      </form>
    );

  }
}

export default withRouter(AnswerForm);