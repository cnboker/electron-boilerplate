import React from 'react'
import {connect} from 'react-redux';
import AnswerForm from './answer_form'
import MarkdownEditor from '~/src/Editors/markdownEditor'
import {createAnswer} from '../../actions/questions_actions';
class AnswerEditor extends React.Component {
  constructor() {
    super()
    this.state = {
     // defaultEditor: 'markdown'
    }
  }

  render() {
    if (this.state.defaultEditor === 'markdown') {
      return (<MarkdownEditor {...this.props}/>)

    } else {
      return (<AnswerForm {...this.props}/>)
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    createAnswer: answer => dispatch(createAnswer(answer))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnswerEditor)