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
      keyInput: "",
      tag:""
    };
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

  textChange(e) {
    this.setState({keyInput: e.target.value});
  }

  tagSelect({tag}) {
    this.setState({tag})
  }

  getExportData(){
    var arr = Object.values(this.props.keywords);
    const {website, keyInput, tag} = this.state;
    //console.log('getPaginateData',this.props)
    if (website) {
      arr = arr.filter(x => {
        return x.link == website;
      });
    }
    if (tag && tag !== '全部') {
      arr = arr.filter(x => {
        return x.tags && x
          .tags
          .indexOf(tag) != -1;
      })
    }
    if (keyInput) {
      arr = arr.filter(x => {
        return x
          .keyword
          .includes(keyInput);
      });
    }
    console.log('export data', arr)
    return arr;
  }

  render() {
    const {profile} = this.props;
    return (
      <div className="animated fadeIn">
        <Dialog ref={"dialog"}/>
        <div className="row">
          <div className="col-md-12">
            <EventNotify vipUserExpired={profile.vipUserExpired}/>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="col-md-6">
            <KeywordToolbar
              getExportData={this.getExportData.bind(this)}
              findAllKeywords={this.props.findAllKeywords}
              onSelectedDelete
              ={this.onSelectedDelete}
              onSelectedReset
              ={this.onSelectedReset}
              tags={this.props.tags}
              keywordsTagUpdate = {this.props.keywordsTagUpdate}
              />
          </div>
          <div className="col-md-6  d-inline-flex">
            <Input
              type="text"
              onChange={this
              .textChange
              .bind(this)}
              placeholder="关键词过滤" className="form-control-sm"/>
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
