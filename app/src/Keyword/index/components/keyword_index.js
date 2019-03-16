import React from "react";
import { Link } from "react-router-dom";
import EventNotify from "./eventNotify";
import WebsiteList from "./keyword_website_list";
import Dialog from "~/src/Components/Modals/Dialog";
import { toast } from "react-toastify";
import KeywordTips from "./keyword_tips";
import KeywordTable from "./keyword_table";

class KeywordIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      website: ""
    };
  }


  componentDidMount() {
    if (Object.keys(this.props.profile).length == 0) {
      this.props.fetchProfile();
    }
    var id = this.props.match.params.id || '';
    this.props.findAllKeywords({ id });
    this.props.findWebsites();
  }



  onFliter(value, e) {
    e.preventDefault();
    this.setState({
      website: value
    });
  }

  render() {
    const { profile } = this.props;
    console.log("state", this.state);
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
            </button>
          </div>
          <div>
            <WebsiteList
              websites={this.props.websites}
              onFliter={this.onFliter.bind(this)}
            />
          </div>
        </div>

        <KeywordTable
          {...this.props}
          onSelectedDelete={f => (this.onSelectedDelete = f)}
          website={this.state.website}
        />
        <KeywordTips />
      </div>
    );
  }
}

export default KeywordIndex;
