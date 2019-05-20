import React from 'react'
import ReactMarkdown from 'react-markdown'
import Editor from './editor'
import SplitPane from "react-split-pane";
var templateContent = require("./markdownTemplate.txt");

export default class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      markdownContent: templateContent.default
    }
    this.onMarkdownChange = this
      .onMarkdownChange
      .bind(this)

  }
  onMarkdownChange(md) {
    this.setState({markdownContent: md})
  }
  render() {
    return (
      <SplitPane split="horizontal"  style={{
        position: 'relative'
      }}>
        <div>
          <button className="btn btn-primary" onClick={this.props.save}>
            保存
          </button>
   
          <button className="btn btn-light" onClick={()=>this.props.history.goBack()}>
            返回
          </button>
        </div>
        <SplitPane style={{
          position: 'relative'
        }}
          split="vertical"
          defaultSize="50%"
          onChange={size => this.toggleBtmHeight(size)}>
          <Editor
            value={this.state.markdownContent}
            onChange={this.onMarkdownChange}/>
          <ReactMarkdown
            className="ReactCodeMirror"
            source={this.state.markdownContent}
            skipHtml={this.state.htmlMode === 'skip'}
            escapeHtml={this.state.htmlMode === 'escape'}/>
        </SplitPane>
      </SplitPane>

    )
  }
}

import './markdownEditor.css'
