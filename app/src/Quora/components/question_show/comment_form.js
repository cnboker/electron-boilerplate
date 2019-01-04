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
  
  componentDidMount(){
    this.messageInput.focus();
  }
  addComment(e) {
    e.preventDefault();
    const comment = this.state;
    if(this.state.content == ''){
      this.messageInput.focus();
      return;
    }
    this
      .props
      .createComment(comment);
      this.setState({
        content:''
      })
      this.toggleExpand();
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
      <br/>
        <div className="form-row">
          <div className="col-10">
            <textarea rows="1" onChange={this.updateContent} className="form-control" value={this.state.content} ref= {(input)=>this.messageInput=input}/>
          </div>
          <div className="col">
            <input type="submit" value="回复" className="btn btn-outline-secondary" />
          </div>
        </div>

      </form>
    );
  }
}

export default CommentForm;