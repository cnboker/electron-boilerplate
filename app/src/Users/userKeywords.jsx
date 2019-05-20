import React from 'react';
import {connect} from 'react-redux'
import {findAllKeywords, createKeyword, updateKeyword, deleteKeyword,findToday} from '~/src/Keyword/index/actions/keywords_actions'
import KeywordTable from '~/src/Keyword/index/components/keyword_table'

class UserKeywordsContainer extends React.Component{
 
  render(){
    return(
      <React.Fragment>
        <button className="btn btn-primary float-right" onClick={()=>this.props.history.goBack()}>返还</button>
     
      <KeywordTable {...this.props}/>
      </React.Fragment>
    )
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    keywords: state.keywords, 
    client: state.client,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    findToday:()=>{
      dispatch(findToday())
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

export default connect(mapStateToProps, mapDispatchToProps)(UserKeywordsContainer)