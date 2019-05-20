import {Tags} from '../Components/tagify/Tagify.react.js'
import React from 'react'
import {connect} from "react-redux";
import {fetchTags, tagUpdate} from './actions'

// setup some basic Tagify settings object
var tagifySettings = {
  blacklist: []
}

// Demo "App" component that is using the Tagify React component (<Tags/>)
class TagCreate extends React.Component {
  constructor(props) {
    super(props);
    const {catelog} = this.props.location.state;
    this.state = {
      catelog
    }

    tagifySettings.callbacks = {
      add: this.onTagifyAdd,
      remove: this.onTagifyRemove,
      input: this.onTagifyInput,
      invalid: this.onTagifyInvalid
    }
  }

  componentDidMount() {
    const {catelog} = this.props.location.state
    this
      .props
      .fetchTags(catelog);
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

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.tags !== this.props.tags) {
      const {catelog} = this.props.location.state

      if (nextProps.tags[catelog]) {
        this
          .tagify
          .addTags(nextProps.tags[catelog].join(','))
      }

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
        <div className="mt-3">
          <button
            className="btn btn-primary"
            onClick={() => this.props.tagUpdate({catelog: this.state.catelog, topic: this.tagify.value})}>保存</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {tags: state.tagReducer}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchTags: (catelog) => {
      dispatch(fetchTags(catelog))
    },
    tagUpdate: (data) => {
      dispatch(tagUpdate(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TagCreate)