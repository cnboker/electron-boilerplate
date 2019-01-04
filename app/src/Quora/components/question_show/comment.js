import React from 'react';
import CommentForm from './comment_form';
import moment from 'moment'
import {TimelineEvent} from 'react-event-timeline'
import Upvote from '../../../Components/Buttons/Upvote'
class Comment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showComments: false,
      showCommentForm: false
    };
    this.toggleCommentForm = this
      .toggleCommentForm
      .bind(this);
  }

  toggleCommentForm() {
    this.setState({
      showCommentForm: !this.state.showCommentForm
    });
  }

  enableDelete() {
    return (this.props.comment.author === this.props.currentUser.userName) || this.props.currentUser.userName === 'admin'
  }
  render() {
    return (
      <div>
        <TimelineEvent
          title={this.props.comment.author}
          createdAt={moment(this.props.comment.create_at).format('YYYY-MM-DD HH:mm')}
          icon={<i className = "icon-speech" > </i>}>
          {this.props.comment.content}
        </TimelineEvent>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-11">
            <Upvote
              vote={this.props.votes[this.props.comment._id]}
              onDislike={()=>this.props.dislike(this.props.comment._id)}
              onLike={()=>this.props.like(this.props.comment._id)}
              delProps={{
              display: this.enableDelete(),
              onDelete: this.props.deleteComment,
              id: this.props.comment._id
            }}
              commentProps={{
              display: false
            }}/>

          </div>
        </div>
      </div>

    )
  }
}

export default Comment;