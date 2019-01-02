import {Tags} from '../../../Components/tagify/Tagify.react.js'
import React from 'react'
import {connect} from "react-redux";
import {fetchAllTopics, updateTopics} from '../../actions/topic_actions'

// setup some basic Tagify settings object
var tagifySettings = {
  blacklist: []
}

// Demo "App" component that is using the Tagify React component (<Tags/>)
class Tag extends React.Component {
  constructor(props) {
    super(props);

    tagifySettings.callbacks = {
      add: this.onTagifyAdd,
      remove: this.onTagifyRemove,
      input: this.onTagifyInput,
      invalid: this.onTagifyInvalid
    }
  }

  componentDidMount() {
    this
      .props
      .fetchAllTopics();
  }

  // callbacks for all of Tagify's events:
  onTagifyAdd = e => {
    console.log('added:', e.detail.data);
  }

  onTagifyRemove = e => {
    console.log('remove:', e.detail);
  }

  onTagifyInput = e => {
    console.log('input:', e.detail);
  }

  onTagifyInvalid = e => {
    console.log('invalid:', e.detail);
  }

  get tagify() {
    return this.refs.tag.tagify;
  }

  componentWillUpdate(nextProps,nextState){
    if(nextProps.topics.length > 0){
      console.log('componet will update')
      this.tagify.addTags(nextProps.topics.join(','))
    }
  }

  render() {
    return (
      <div>
        <Tags
          ref="tag"
          mode='textarea'
          autofocus={true}
          className='tagify'
          name='tags'
          settings={tagifySettings}
          initialValue=''/>
        <p>
          <button
            className="btn btn-primary"
            onClick={()=>this
            .props
            .updateTopics(this.tagify.value)}>保存</button>
        </p>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    topics:state.topic.all
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAllTopics: () => {
      dispatch(fetchAllTopics())
    },
    updateTopics: (data) => {
      dispatch(updateTopics(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tag)