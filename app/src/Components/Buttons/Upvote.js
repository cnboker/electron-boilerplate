import React, {Component} from 'react'
import Dialog from "../Modals/Dialog";
import PropTypes from 'prop-types';

export default class Upvote extends Component {
  onDelete(id, event) {

    this
      .refs
      .dialog
      .show({
        title: "提示",
        body: "确定要删除此项吗?",
        actions: [
          Dialog.CancelAction(() => {
            console.log("dialog cancel");
          }),
          Dialog.OKAction(() => {
            this
              .props
              .delProps
              .onDelete(id)
          })
        ],
        bsSize: "small",
        onHide: dialog => {
          dialog.hide();
        }
      });
  }

  render() {
    const {children, commentProps, onLike, onDislike, vote, delProps} = this.props;
    console.log('upvote',this.props)
    return (
      <div className="card-block">
        <Dialog ref="dialog"/>
        <p>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            style={{
            marginRight: "15px"
          }}
            onClick={onLike}>
            <i className="icon-like"></i>
            {" "}{vote.like}
          </button>
          <button
            type="button"
            className="btn btn-outline-dark btn-sm"
            style={{
            marginRight: "15px"
          }}
            onClick={onDislike}>
            <i className="icon-dislike"></i>
            {" "}{vote.dislike}
          </button>
          {commentProps.display &&<button type = "button" className = "btn btn-outline-info btn-sm" style = {{marginRight:"15px"}} onClick = {
            commentProps.onComment
          } > <i className="icon-speech"></i> </button>}
          {delProps.display && <button type = "button" className = "btn btn-outline-danger btn-sm" style = {{marginRight:"15px"}} onClick = {
            this
              .onDelete
              .bind(this, delProps.id)
          } > <i className="fa fa-trash"></i> </button>}
          {children}
        </p>
      </div>
    )
  }
}

Upvote.protoTypes = {
  commentProps: PropTypes.object,
  onLike: PropTypes.func,
  onDislike: PropTypes.func,
  delProps: PropTypes.object,
  vote:PropTypes.object
}

Upvote.defaultProps = {
  vote:{
    like:0,
    dislike:0
  },
  commentProps: {
    display: true
  },
  delProps: {
    display: false
  }
};