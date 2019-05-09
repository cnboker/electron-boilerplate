import React from "react";
import KeywordItem from "./keyword_item";
import Dialog from "~/src/Components/Modals/Dialog";
import Pager from "~/src/Components/Tables/Pager";
import { toast } from "react-toastify";

const PAGE_SIZE = 30;
class KeywordTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      data: [],
      pageCount: 0,
      selectAll: false
    };
  }

  getPaginateData(page) {
    var currentIndex = page * PAGE_SIZE;
    var arr = Object.values(this.props.keywords);
    const { website, keyInput } = this.props;
    if (website) {
      arr = arr.filter(x => {
        return x.link == website;
      });
    }
    if (keyInput) {
      arr = arr.filter(x => {
        return x.keyword.includes(keyInput);
      });
    }
    return {
      pageCount: Math.ceil(arr.length / PAGE_SIZE),
      data: arr.slice(currentIndex, currentIndex + PAGE_SIZE)
    };
  }

  componentDidMount() {
    var id = this.props.match.params.id || "";
    this.props.findAllKeywords({ id });
    if (this.props.onSelectedDelete) {
      this.props.onSelectedDelete(this.onSelectedDelete.bind(this));
    }
    if (this.props.onSelectedReset) {
      this.props.onSelectedReset(this.onSelectedReset.bind(this));
    }
  }

  componentDidUpdate(previousProps, previousState) {
    if (
      previousProps.keywords !== this.props.keywords ||
      previousProps.website !== this.props.website ||
      previousProps.keyInput !== this.props.keyInput
    ) {
      var page = this.state.page;
      if (
        previousProps.website !== this.props.website ||
        previousProps.keyInput !== this.props.keyInput
      ) {
        page = 0;
      }
      this.setState({
        ...this.state,
        ...this.getPaginateData(page),
        page
      });
    }
  }

  pagination = page => {
    console.log("pagination........");
    const { data } = this.getPaginateData(page);
    this.setState({
      page,
      data: data
    });
  };

  toggleSwitch(item, e) {
    var entity = {
      ...item,
      ...{
        status: item.status == 1 ? 2 : 1
      }
    };
    this.props.updateKeyword(entity);
  }

  onReset(entity, event) {
    event.preventDefault();
    this.refs.dialog.show({
      title: "提示",
      body: "确定要重置此项吗?",
      actions: [
        Dialog.CancelAction(() => {
          console.log("dialog cancel");
        }),
        Dialog.OKAction(() => {
          entity.action = "reset";
          this.props.updateKeyword(entity);
        })
      ]
    });
  }

  onDelete(entity, event) {
    event.preventDefault();
    console.log("this.refs", this.refs);
    this.refs.dialog.show({
      title: "提示",
      body: "确定要删除此项吗?",
      actions: [
        Dialog.CancelAction(() => {
          console.log("dialog cancel");
        }),
        Dialog.OKAction(() => {
          this.props.deleteKeyword(entity._id);
        })
      ]
    });
  }

  selectAll(e) {
    this.setState({ selectAll: e.target.checked });
    this.state.data.map(x => {
      x.selected = e.target.checked;
    });
  }

  //   onFliter(value, e) {
  //     e.preventDefault();
  //     const result = this.getPaginateData(this.state.page, value);
  //     this.setState({
  //       ...result
  //     });
  //   }

  onSelectedDelete(e) {
    e.preventDefault();
    var ids = this.state.data.filter(x => x.selected).map(x => x._id);
    if (ids.length == 0) {
      toast.error("请选择要删除的行", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      return;
    }

    this.refs.dialog.show({
      title: "提示",
      body: "确定要删除选择项吗?",
      actions: [
        Dialog.CancelAction(() => {
          console.log("dialog cancel");
        }),
        Dialog.OKAction(() => {
          this.props.deleteKeyword(ids.join(","));
        })
      ]
    });
  }

  onSelectedReset(e) {
    e.preventDefault();
    var items = this.state.data.filter(x => x.selected);
    if (items.length == 0) {
      toast.error("请选择要重置的行", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      return;
    }

    this.refs.dialog.show({
      title: "提示",
      body: "确定要重置选择项吗?",
      actions: [
        Dialog.CancelAction(() => {
          console.log("dialog cancel");
        }),
        Dialog.OKAction(() => {
          for (var item of items) {
            item.action = "reset";
            this.props.updateKeyword(item);
          }
        })
      ]
    });
  }

  render() {
    console.log("state", this.state);
    return (
      <div>
        <Dialog ref={"dialog"} />
        <div className="table-responsive">
          <br />
          <table className="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" onClick={e => this.selectAll(e)} />
                </th>
                <th
                  style={{
                    width: "22%",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  关键词
                </th>
                <th>匹配网址</th>
                <th>初始排名</th>
                <th>最新排名</th>
                <th>变化</th>
                <th>商业热度</th>
                <th>竞争度</th>
                {this.props.client.userName === "admin" && <th>点击</th>}
                <th>有效</th>
                <th>状态</th>
                <th>跟踪</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((x, index) => {
                return (
                  <KeywordItem
                    data={x}
                    {...this.props}
                    key={index}
                    onDelete={this.onDelete.bind(this)}
                    onReset={this.onReset.bind(this)}
                    toggleSwitch={this.toggleSwitch.bind(this)}
                  />
                );
              })}
            </tbody>
          </table>
          <br />
          <div className="float-right">
            <Pager
              pageCount={this.state.pageCount}
              onPageChange={e => this.pagination(e.selected)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default KeywordTable;
