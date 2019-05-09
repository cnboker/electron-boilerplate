import React from "react";
import { Input } from "reactstrap";
import { Link } from "react-router-dom";
import EventNotify from "./eventNotify";
import WebsiteList from "./keyword_website_list";
import Dialog from "~/src/Components/Modals/Dialog";
import KeywordTips from "./keyword_tips";
import KeywordTable from "./keyword_table";

import { stringFormat, DifferenceFormatter } from "./util";
import { CSVLink } from "react-csv";

class KeywordIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      website: "",
      keyInput: "",
      exportData: []
    };
  }

  componentDidMount() {
    if (Object.keys(this.props.profile).length == 0) {
      this.props.fetchProfile();
    }
    var id = this.props.match.params.id || "";
    this.props.findAllKeywords({ id });
    this.props.findWebsites();
  }

  onFliter(value, e) {
    e.preventDefault();
    this.setState({
      website: value
    });
  }

  textChange(e) {
    this.setState({
      keyInput: e.target.value
    });
  }

  exportCvsHeader() {
    return [
      { label: "关键词", key: "keyword" },
      { label: "匹配网址", key: "link" },
      { label: "初始排名", key: "originRank" },
      { label: "最新排名", key: "dynamicRank" },
      { label: "变化", key: "diff" },
      { label: "商业热度", key: "adIndexer" },
      { label: "竞争度", key: "resultIndexer" }
    ];
  }

  exportCVSData() {
    console.log("exportCVSData");
    return Object.values(this.props.keywords)
      .filter(x => {
        return x.originRank !== -1 && x.dynamicRank !== -1;
      })
      .map(item => {
        return {
          keyword: item.keyword,
          link: item.link,
          originRank: stringFormat(item.originRank),
          dynamicRank: stringFormat(item.dynamicRank),
          diff: DifferenceFormatter(item.dynamicRank, item.originRank),
          adIndexer: stringFormat(item.adIndexer),
          resultIndexer: stringFormat(item.resultIndexer)
        };
      });
  }

  render() {
    const { profile } = this.props;
    return (
      <div className="animated fadeIn">
        <Dialog ref={"dialog"} />
        <div className="row">
          <div className="col-md-12">
            <EventNotify vipUserExpired={profile.vipUserExpired} />
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="col-md-6">
            <Link to={"/keyword/new"} role="button" className="btn btn-success">
              新建
            </Link>{" "}
            <button
              id="pageRefresh"
              onClick={() => {
                this.props.findAllKeywords();
              }}
              role="button"
              className="btn btn-info"
            >
              刷新
            </button>{" "}
            <button
              onClick={e => this.onSelectedDelete(e)}
              role="button"
              className="btn btn-danger"
            >
              批量删除
            </button>{" "}
            <button
              onClick={e => this.onSelectedReset(e)}
              role="button"
              className="btn btn-warning"
            >
              批量重置
            </button>{" "}
            <CSVLink
              data={this.state.exportData}
              headers={this.exportCvsHeader()}
              asyncOnClick={true}
              onClick={async (event, done) => {
                const exportData = this.exportCVSData();
                this.setState({ exportData }, () => done());
              }}
              className="btn btn-primary"
            >
              导出
            </CSVLink>
          </div>
          <div className="col-md-6  d-inline-flex">
            <Input
              type="text"
              onChange={this.textChange.bind(this)}
              placeholder="关键词过滤"
            />
            <WebsiteList
              websites={this.props.websites}
              onFliter={this.onFliter.bind(this)}
            />
          </div>
        </div>

        <KeywordTable
          {...this.props}
          onSelectedDelete={f => (this.onSelectedDelete = f)}
          onSelectedReset={f => (this.onSelectedReset = f)}
          website={this.state.website}
          keyInput={this.state.keyInput}
        />
        <KeywordTips />
      </div>
    );
  }
}

export default KeywordIndex;
