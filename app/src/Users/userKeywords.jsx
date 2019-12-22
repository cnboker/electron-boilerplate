import React from 'react';
import {connect} from 'react-redux'
import {findAllKeywords, createKeyword, updateKeyword, deleteKeyword,findToday} from '~/src/Keyword/index/actions/keywords_actions'
import KeywordTable from '~/src/Keyword/index/components/keyword_table'

class UserKeywordsContainer extends React.Component{
  componentDidMount(){
    var id = this.props.match.params.id || "";
    this
      .props
      .findAllKeywords({id});
  }
  
  render(){
    return(
      <React.Fragment>
        <button className="btn btn-primary" onClick={()=>this.props.history.goBack()}>返回</button>
     
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