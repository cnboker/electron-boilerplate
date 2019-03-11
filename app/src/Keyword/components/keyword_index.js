import React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import EventNotify from './eventNotify'
import WebsiteList from './keyword_website_list'
import KeywordItem from './keyword_item'
import Dialog from "../../Components/Modals/Dialog";
import Pager from '../../Components/Tables/Pager'
import {toast} from 'react-toastify';

const PAGE_SIZE = 10;
class KeywordIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 0,
      data: [],
      pageCount: 0,
      selectAll: false
    }
  }

  getPaginateData(page,website) {
    var currentIndex = (page) * PAGE_SIZE
    var arr = Object.values(this.props.keywords);
    if (website) {
      arr = arr.filter(x => {
        return x.link == website
      })
    }
    return {
      pageCount: Math.ceil(arr.length / PAGE_SIZE),
      data: arr.slice(currentIndex, currentIndex + PAGE_SIZE)
    }
  }

  componentDidMount() {
    if (Object.keys(this.props.profile).length == 0) {
      this
        .props
        .fetchProfile();
    }
    this
      .props
      .findAllKeywords();
    this
      .props
      .findWebsites();
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousProps.keywords !== this.props.keywords) {
      this.setState({
        ...this.state,
        ...this.getPaginateData(this.state.page)
      });
    }
  }

  pagination = target => {
    console.log('pagination........')
    const {data} = this.getPaginateData(target.selected)
    this.setState({
      page: target.selected,
      data:data
    })
  }

  toggleSwitch(item, e) {
    var entity = {
      ...item,
      ...{
        status: item.status == 1
          ? 2
          : 1
      }
    };
    this
      .props
      .updateKeyword(entity)
  }

  onFliter(value, e) {
    e.preventDefault();
    const result = this.getPaginateData(this.state.page,value)
    this.setState({
      ...result
    })
  }

  onReset(entity, event) {
    event.preventDefault();
    this
      .refs
      .dialog
      .show({
        title: "提示",
        body: "确定要重置此项吗?",
        actions: [
          Dialog.CancelAction(() => {
            console.log("dialog cancel");
          }),
          Dialog.OKAction(() => {
            entity.action = 'reset';
            this
              .props
              .updateKeyword(entity)
          })
        ],
        bsSize: "small",
        onHide: dialog => {
          dialog.hide();
        }
      });
  }

  onDelete(entity, event) {
    event.preventDefault();
    console.log('this.refs', this.refs)
    this
      .refs
      .dialog
      .show({
        title: "提示",
        body: "确定要删除此项吗?",
        actions: [
          Dialog.CancelAction(() => {
            console.log("dialog cancel");
          }),
          Dialog.OKAction(() => {
            this
              .props
              .deleteKeyword(entity._id)
          })
        ],
        bsSize: "small",
        onHide: dialog => {
          dialog.hide();
        }
      });
  }
  selectAll(e) {
    this.setState({selectAll: e.target.checked});
    this
      .state
      .data
      .map(x => {
        x.selected = e.target.checked;
      })
  }
  onSelectedDelete(e) {
    e.preventDefault();
    var ids = this
      .state
      .data
      .filter(x => x.selected)
      .map(x => x._id);
    if (ids.length == 0) {
      toast.error('请选择要删除的行', {position: toast.POSITION.BOTTOM_CENTER});
      return;
    }
    this
      .refs
      .dialog
      .show({
        title: "提示",
        body: "确定要删除选择项吗?",
        actions: [
          Dialog.CancelAction(() => {
            console.log("dialog cancel");
          }),
          Dialog.OKAction(() => {
            this
              .props
              .deleteKeyword(ids.join(','))
          })
        ],
        bsSize: "small",
        onHide: dialog => {
          dialog.hide();
        }
      });
  }

  render() {
    const {profile} = this.props;
    console.log('state', this.state)
    return (
      <div className="animated fadeIn">
        <Dialog ref={'dialog'}/>
        <div className="row">
          <div className="col-md-12">
            <EventNotify vipUserExpired={profile.vipUserExpired}/>
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
              this
                .props
                .findAllKeywords();
            }}
              role="button"
              className="btn btn-info">
              刷新
            </button>{' '}
            <button
              onClick={(e) => this.onSelectedDelete(e)}
              role="button"
              className="btn btn-danger">
              批量删除
            </button>
          </div>
          <div>
            <WebsiteList
              websites={this.props.websites}
              onFliter={this
              .onFliter
              .bind(this)}/>
          </div>
        </div>

        <div className="table-responsive">
          <br/>
          <table className="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <th><input type="checkbox" onClick={(e) => this.selectAll(e)}/></th>
                <th
                  style={{
                  width: "22%",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  关键词
                </th>
                <th>匹配网址</th>
                <th>初始排名</th>
                <th>最新排名</th>
                <th>变化</th>
                <th>商业热度</th>
                <th>有效</th>
                <th>状态</th>
                <th>跟踪</th>
                <th/>
              </tr>
            </thead>
            <tbody>{this
                .state
                .data
                .map((x, index) => {
                  return <KeywordItem
                    data={x}
                    { ...this.props }
                    key={index}
                    onDelete={this
                    .onDelete
                    .bind(this)}
                    onReset={this
                    .onReset
                    .bind(this)}
                    toggleSwitch={this.toggleSwitch.bind(this)}
                    />
                })}</tbody>
          </table>
          <br/>
          <div className="pull-right">
            <Pager
              pageCount={this.state.pageCount}
              onPageChange={this
              .pagination
              .bind(this)}></Pager>
          </div>
          <div>
            <p>
              注：正常情况下，提交关键字后，约2分钟会出现初始排名数据.
              <br/>
              1.初始排名数据在1~120之间，则表明系统正常运行，将软件最小化即可.{" "}
              <br/>
              2. 若较长时间后，初始排名数据仍为0，表明系统未正常启动检测功能。请查看“帮助" 及时处理.
              <br/>
              3. 若初始排名数据显示为120+，则表明目标网页排名在12页以后，页面质量较弱，系统停止检测，请查看 "帮助" 进行针对性解决.
            </p>
          </div>
        </div>
      </div>

    )
  }
}

export default KeywordIndex