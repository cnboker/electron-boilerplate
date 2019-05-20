import React from 'react'
import CodeMirror from 'react-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
//import 'codemirror/mode/python/python'
//import 'codemirror/mode/xml/xml'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/theme/monokai.css'

class Editor extends React.Component {

  updateCode(e) {
    this
      .props
      .onChange(e)
  }
  render() {
    var options = {
      mode: 'markdown',
      theme: 'monokai',
      lineNumbers: true,

    }
    return (<CodeMirror 
      value={this.props.value}
      style={{height:"500px"}}
      options={options}
      onChange={this
      .updateCode
      .bind(this)} autoFocus={true}/>);
  }
}

export default Editor;