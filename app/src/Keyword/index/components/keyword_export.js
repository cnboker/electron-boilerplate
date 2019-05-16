import React from 'react'
import {CSVLink} from "react-csv";
import { stringFormat, DifferenceFormatter } from "./util";

export default class CVSExport extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      exportData: []
    }
  }

  exportCvsHeader() {
    return [
      {
        label: "关键词",
        key: "keyword"
      }, {
        label: "匹配网址",
        key: "link"
      }, {
        label: "初始排名",
        key: "originRank"
      }, {
        label: "最新排名",
        key: "dynamicRank"
      }, {
        label: "变化",
        key: "diff"
      }, {
        label: "商业热度",
        key: "adIndexer"
      }, {
        label: "竞争度",
        key: "resultIndexer"
      }
    ];
  }

  exportCVSData() {
    console.log("exportCVSData");
    return Object
      .values(this.props.keywords)
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
    return (
      <React.Fragment>
        <CSVLink
          data={this.state.exportData}
          headers={this.exportCvsHeader()}
          asyncOnClick={true}
          onClick={async(event, done) => {
          const exportData = this.exportCVSData();
          this.setState({
            exportData
          }, () => done());
        }}
          className="btn btn-primary">
          导出
        </CSVLink>
      </React.Fragment>
    )
  }
}