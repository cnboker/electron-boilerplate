import {connect} from 'react-redux'
import {findAllKeywords, createKeyword, updateKeyword, deleteKeyword,findWebsites,keywordsTagUpdate} from '../actions/keywords_actions'
import KeywordIndex from './keyword_index'
import {fetchProfile} from '~/src/Profile/action'
import {fetchTags,tagSelect} from '~/src/Tags/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    keywords: state.keywords, 
    websites: state.websites, 
    client: state.client,
    profile:state.userProfile,
    tags:state.tagReducer
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchProfile:()=>{
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
    fetchTags:()=>{
      dispatch(fetchTags('keyword'))
    },
    tagSelect:(catelog,tagName)=>{
      dispatch(tagSelect(catelog,tagName))
    },
    keywordsTagUpdate:(ids,tags)=>{
      dispatch(keywordsTagUpdate(ids,tags))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeywordIndex)