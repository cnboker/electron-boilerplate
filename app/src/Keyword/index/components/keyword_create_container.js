import {connect} from 'react-redux'
import {createKeyword,updateKeyword} from '../actions/keywords_actions'
import KeywordCreate from './keyword_create'

const mapStateToProps = (state, ownProps) => {
  return {
    keywords: state.keywords, 
    client: state.client,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createKeyword: (keyword) => {
      dispatch(createKeyword(keyword))
    },
    updateKeyword: (keyword) => {
      dispatch(updateKeyword(keyword))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeywordCreate)