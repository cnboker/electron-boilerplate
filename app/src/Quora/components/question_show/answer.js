import React from 'react';
import CommentForm from './comment_form';
import Comment from './comment';
import {Card} from '../../../Components/Cards/Card'

class HtmlBody extends React.Component{
  rawMarkup(){
      var rawMarkup = this.props.content
      return { __html: rawMarkup };
  }
  render(){
      return(
              <div className="modal-body">
                   <span dangerouslySetInnerHTML={this.rawMarkup()} />

              </div>
          )
  }
}

class Answer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showComments: false
    };
    this.toggleComments = this
      .toggleComments
      .bind(this);
    this.deleteAnswer = this
      .deleteAnswer
      .bind(this);
  }

  toggleComments() {
    this.setState({
      showComments: !this.state.showComments
    });
  }

  deleteAnswer() {
    if (this.props.answer.author === this.props.currentUser.userName) {
      this
        .props
        .deleteAnswer(this.props.answer._id);
    }
  }
  htmlRender(){
    var decode = require('js-htmlencode').htmlDecode;

    return decode(this.props.answer.content)
  }
  render() {
    if (!this.props.answer) {
      return (
        <h5>加载...</h5>
      );
    }

    return (
      <Card headerTitle={this.props.answer.author} className="card-outline-info">
        <div className="answer-body">
          <HtmlBody content={this.htmlRender()}/>
         
        </div>
        <hr/>
        <div className="answer-footer">
          <a onClick={this.toggleComments} className="btn btn-outline-primary">评论</a>{" "}
          {this.props.answer.author === this.props.currentUser.userName && <button onClick={this.deleteAnswer} className="btn btn-danger">删除回答</button>}
        </div>
        {this.state.showComments && <div className="answer-comments">
          <CommentForm
            question={this.props.question}
            createComment={this.props.createComment}
            commentableType={"Answer"}
            commentableId={this.props.answer._id}
            currentUser={this.props.currentUser}/>
          <div className="comment-list">
            {this.props.answer.comments && Object
              .keys(this.props.answer.comments)
              .map(key => <Comment
                key={key}
                comment={this.props.answer.comments[key]}
                question={this.props.question}
                createComment={this.props.createComment}
                deleteComment={this.props.deleteComment}
                commentableType={"Answer"}
                commentableId={this.props.answer.id}
                currentUser={this.props.currentUser}/>)}
          </div>
        </div>}
      </Card>

    );
  }
}

export default Answer;