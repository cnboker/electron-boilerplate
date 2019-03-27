import {connect} from 'react-redux'
import {findAllKeywords, createKeyword, updateKeyword, deleteKeyword,findWebsites} from '../actions/keywords_actions'
import KeywordIndex from './keyword_index'
import {fetchProfile} from '~/src/Profile/action'

const mapStateToProps = (state, ownProps) => {
  return {
    keywords: state.keywords, 
    websites: state.websites, 
    client: state.client.token,
    profile:state.userProfile
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
    }
   
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeywordIndex)