import React from 'react';
import CommentForm from './comment_form';
import Comment from './comment';
import {Card} from '../../../Components/Cards/Card'
import moment from 'moment'
import {Timeline} from 'react-event-timeline'
import Upvote from '../../../Components/Buttons/Upvote'
class HtmlBody extends React.Component {
  rawMarkup() {
    var rawMarkup = this.props.content
    return {__html: rawMarkup};
  }
  render() {
    return (
      <div className="modal-body">
        <span dangerouslySetInnerHTML={this.rawMarkup()}/>

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
    this
        .props
        .deleteAnswer(this.props.answer._id);
  }

  htmlRender() {
    var decode = require('js-htmlencode').htmlDecode;

    return decode(this.props.answer.content)
  }

  enableDelete() {
    return (this.props.answer.author === this.props.currentUser.userName) || this.props.currentUser.userName === 'admin'
  }
  render() {
    if (!this.props.answer) {
      return (
        <h5>加载...</h5>
      );
    }

    return (
      <Card
        headerTitle={moment(this.props.answer.create_at).format('YYYY-MM-DD') + '@' + this.props.answer.author}
        className="card-outline-info">
        <div className="answer-body">
          <HtmlBody content={this.htmlRender()}/>
        </div>
        <div className="answer-footer">
          <Upvote
            vote={this.props.votes[this.props.answer._id]}
            onDislike={()=>this.props.dislike(this.props.answer._id)}
            onLike={()=>this.props.like(this.props.answer._id)}
           
            delProps={{
            display: this.enableDelete(),
            onDelete: this.deleteAnswer,
            id:this.props.answer._id
          }}
            commentProps={{
            display: true,
            onComment: this.toggleComments
          }}/>
        </div>

        {this.state.showComments && <CommentForm
          question={this.props.question}
          createComment={this.props.createComment}
          commentableType={"Answer"}
          commentableId={this.props.answer._id}
          currentUser={this.props.currentUser}/>
      }
        <hr/> {(this.props.answer.comments && Object.keys(this.props.answer.comments).length > 0) && <Timeline>
          {Object
            .keys(this.props.answer.comments)
            .map(key => <Comment
              key={key}
              comment={this.props.answer.comments[key]}
              question={this.props.question}
              createComment={this.props.createComment}
              deleteComment={this.props.deleteComment}
              commentableType={"Answer"}
              commentableId={this.props.answer.id}
              currentUser={this.props.currentUser}
              votes={this.props.votes}
              like={this.props.like}
              dislike={this.props.dislike}
              />)}
        </Timeline>
}
      </Card>

    );
  }
}

export default Answer;