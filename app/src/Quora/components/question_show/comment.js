import React from 'react';
import CommentForm from './comment_form';
import moment from 'moment'
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

  render() {
    
    return (
      <div className="comment">
        <div className="comment-header">
          <span>{moment(this.props.comment.create_at).format('YYYY-MM-DD') + '@' + this.props.comment.author}</span>
        </div>
        <div className="comment-body">
          {this.props.comment.content}
        </div>
      </div>
    )
  }
}

  export default Comment;