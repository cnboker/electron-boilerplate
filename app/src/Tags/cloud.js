import React from 'react'
import axios from 'axios'
import {toast} from "react-toastify";
import {connect} from "react-redux";
import {TagCloud} from 'react-tagcloud'

export default class TopicCloud extends React.Component {
  constructor(props) {
    super(props);
  }

  // Render <Textarea> element and applies Tagify on it
  render() {
    return (
      <div>
        <TagCloud
          minSize={12}
          maxSize={28}
          tags={this.props.topicCloud}
          onClick={(tag) => this.props.fetchTopic(tag.value)}/>
      </div>
    )
  }
}
