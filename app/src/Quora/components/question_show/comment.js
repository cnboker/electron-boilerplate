import React from 'react';
import CommentForm from './comment_form';

class Comment extends React.Component {

  constructor(props){
    super(props);
    this.state = { showComments: false, showCommentForm: false };
    this.toggleCommentForm = this.toggleCommentForm.bind(this);
  }

  toggleCommentForm(){
    this.setState({
      showCommentForm: !this.state.showCommentForm
    });
  }

  render(){
    if (!this.props.comment){
      return (<h2>Loading</h2>);
    }
    return(
      <div className="comment">
        <div className = "comment-header">
          <span>{this.props.comment.author}</span>
        </div>
        <div className = "comment-body">
          {this.props.comment.content}
        </div>
        <div className = "comment-footer" style={{display:"none"}}>
          <button type="button" className="btn btn-secondary" onClick={this.toggleCommentForm}>回复</button>
        </div>
        <div className = "comment-comments">
          {
            this.state.showCommentForm &&
            <CommentForm
              question={this.props.question}
              createComment={this.props.createComment}
              commentableType={"Comment"}
              commentableId={this.props.comment._id}
              currentUser={this.props.currentUser}
              />
          }
          <div className="comment-list">
            {this.props.comment.comments &&
              Object.keys(this.props.comment.comments).map(key =>
                <div>
                  <Comment key={key} comment={this.props.comment.comments[key]}/>
                </div>)}
          </div>
        </div>

      </div>
    );
  }
}

export default Comment;