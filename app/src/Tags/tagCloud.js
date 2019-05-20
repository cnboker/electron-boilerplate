import React from 'react'
import {TagCloud} from 'react-tagcloud'

export default class TopicCloud extends React.Component {
  
  render() {
    return (
      <React.Fragment>
        <TagCloud
          minSize={12}
          maxSize={30}
          tags={this.props.tags}
          onClick={(tag) => this.props.fetchTopic(tag.value)}/>
      </React.Fragment>
    )
  }
}