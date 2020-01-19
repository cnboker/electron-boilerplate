import React from 'react'
import {connect} from 'react-redux'
import {
  findAllKeywords,
  createKeyword,
  updateKeyword,
  deleteKeyword,
  findWebsites,
  keywordsTagUpdate,
  detailView
} from '../actions/keywords_actions'
import KeywordIndex from './keyword_index'
import {fetchProfile} from '~/src/Profile/action'
import {fetchTags, tagSelect} from '~/src/Tags/actions'
import Analysis from '../../trace/index'

class KeywordContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      mainPage: true,
      analysisId: ''
    }
  }

  componentDidUpdate(preProps) {
    if (preProps.analysisId !== this.props.analysisId) {
      this.setState({
        mainPage: this.props.analysisId.length === 0,
        analysisId: this.props.analysisId
      })
    }
  }

  render() {

    return (
      <React.Fragment>
        <div
          style={{
          display: this.state.mainPage
            ? "block"
            : "none"
        }}><KeywordIndex {...this.props}/>

        </div>
        <div
          style={{
          display: this.state.mainPage
            ? "none"
            : "block"
        }}><Analysis analysisId={this.state.analysisId} {...this.props}/></div>

      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    keywords: state.keywordState.keywords,
    analysisId: state.keywordState.analysisId,
    websites: state.keywordState.websites,
    client: state.client,
    profile: state.userProfile,
    tags: state.tagReducer
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    detailView: (id) => {
      dispatch(detailView(id))
    },
    fetchProfile: () => {
      dispatch(fetchProfile())
    },
    findWebsites: () => {
      dispatch(findWebsites())
    },
    findAllKeywords: (searchTerms) => {
      dispatch(findAllKeywords(searchTerms))
    },
    createKeyword: (keyword) => {
      dispatch(createKeyword(keyword))
    },
    updateKeyword: (keyword) => {
      dispatch(updateKeyword(keyword))
    },
    deleteKeyword: (id) => {
      dispatch(deleteKeyword(id))
    },
    fetchTags: () => {
      dispatch(fetchTags('keyword'))
    },
    tagSelect: (catelog, tagName) => {
      dispatch(tagSelect(catelog, tagName))
    },
    keywordsTagUpdate: (ids, tags) => {
      dispatch(keywordsTagUpdate(ids, tags))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeywordContainer);