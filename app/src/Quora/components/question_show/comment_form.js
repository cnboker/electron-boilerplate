import React from 'react';
import {withRouter} from 'react-router';

class CommentForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: "",
      commentable_id: this.props.commentableId,
      commentable_type: this.props.commentableType,
      expanded: false,
      question_id:this.props.question._id
    };
    this.updateContent = this
      .updateContent
      .bind(this);
    this.addComment = this
      .addComment
      .bind(this);
  }

  addComment(e) {
    e.preventDefault();
    const comment = this.state;
    this
      .props
      .createComment(comment);
  }

  updateContent(e) {
    this.setState({["content"]: e.currentTarget.value});
  }

  toggleExpand() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    return (
      <form onSubmit={this.addComment}>
        <div className="form-row">
          <div className="col-10">
            <textarea rows="1" onChange={this.updateContent} className="form-control"/>
          </div>
          <div className="col">
            <input type="submit" value="回复" className="btn btn-outline-secondary"/>
          </div>
        </div>

      </form>
    );
  }
}

export default CommentForm;