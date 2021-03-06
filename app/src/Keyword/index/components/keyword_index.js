import React from "react";
import {Input} from "reactstrap";
import EventNotify from "./eventNotify";
import WebsiteList from "./keyword_website_list";
import Dialog from "~/src/Components/Modals/Dialog";
import KeywordTips from "./keyword_tips";
import KeywordTable from "./keyword_table";
import KeywordToolbar from './keyword_toolbar'
import Tags from '../../../Tags/index'

class KeywordIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      website: "",
      
      tag:""
    };
    this.keyInput =''
  }

  componentDidMount() {
    if (Object.keys(this.props.profile).length == 0) {
      this
        .props
        .fetchProfile(); 
    }
    var id = this.props.match.params.id || "";
   
    this
      .props
      .findAllKeywords({id});
    this
      .props
      .findWebsites();
    this
      .props
      .fetchTags();
  }

  onFliter(value, e) {
    e.preventDefault();
    this.setState({website: value});
  }

  handleKeyPress(event) {
    //this.setState({keyInput: e.target.value});
    var id = this.props.match.params.id || "";
    
    if(event.key === 'Enter'){
      var keyword = `${this.keyInput}`;
      this
      .props
      .findAllKeywords({id,keyword});
    }
  }

  tagSelect({tag}) {
    this.setState({tag})
  }

 

  render() {
    const {profile} = this.props;
    return (
      <div className="animated fadeIn">
        <Dialog ref={"dialog"}/>
        <div className="row">
          <div className="col-md-12">
            <EventNotify  {...this.props}/>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="col-md-6">
            <KeywordToolbar
              keywords = {this.props.keywords}
              findAllKeywords={this.props.findAllKeywords}
              onSelectedDelete
              ={this.onSelectedDelete}
              onSelectedReset
              ={this.onSelectedReset}
              tags={this.props.tags}
              keywordsTagUpdate = {this.props.keywordsTagUpdate}
              />
          </div>
          <div className="col-md-6  d-inline-flex ">
            <Input
              type="text"
              onKeyPress={this.handleKeyPress.bind(this)}
              onChange={(e)=>this.keyInput = e.target.value}
              placeholder="输入关键字敲回车键" className="form-control-sm" style={{width:'240px'}} />
            <WebsiteList
              websites={this.props.websites}
              onFliter={this
              .onFliter
              .bind(this)}/>
          </div>
        </div>
        <Tags
          catelog={'keyword'}
          tags={this.props.tags['keyword']}
          tagSelect={this.tagSelect.bind(this)}/>
        <KeywordTable
          {...this.props}
          onSelectedDelete={f => (this.onSelectedDelete = f)}
          onSelectedReset={f => (this.onSelectedReset = f)}
          {...this.state}
          />
        <KeywordTips/>
      </div>
    );
  }
}

export default KeywordIndex;
