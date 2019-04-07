import React from 'react'
import FireBox from './firebox'
import RankDifferenceFormatter from './rankDifferenceFormatter'
import {Link} from 'react-router-dom'
import {Switch} from "~/src/Components/Forms/Switch";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faSignal,faUndo} from '@fortawesome/free-solid-svg-icons'

export default class KeywordItem extends React.Component {
  constructor(){
    super()
    this.state = {selected:false}
  }
  stringFormat(val) {
    if (val == undefined) 
      return "-";
    if (val === true) 
      return "是";
    if (val === false) 
      return "否";
    if (Number.isInteger(val)) {
      if (val == -1) 
        return "120+";
      return val;
    }
    if (this.isValidDate(val)) {
      return moment(val).format("YYYY-MM-DD");
    }
    return val;
  }

  componentDidUpdate(previousProps){
    if(previousProps.data !== this.props.data){
      this.setState({selected:false})
    }
  }
  isValidDate(value) {
    var dateWrapper = new Date(value);
    return !isNaN(dateWrapper.getDate());
  }

  statusFormat(value) {
    if (value == 1) 
      return "在运行";
    if (value == 2) 
      return "已停止";
    return "未知";
  }
  selected(item,e){
    this.setState({selected:e.target.checked})
    item.selected = e.target.checked;
  }
  render() {
    const item = this.props.data;
    console.log('rerender')
    return (
      <tr key={item._id}>
        <td>
          <input type="checkbox" checked={item.selected} onClick={this.selected.bind(this,item)}/>
        </td>
        <td
          style={{
          overflow: "hidden",
          whiteSpace: "initial"
        }}>
          {item.keyword}
        </td>
        <td>{item.link}</td>
        <td>{this.stringFormat(item.originRank)}</td>
        <td>{this.stringFormat(item.dynamicRank)}</td>
        <td>
          <RankDifferenceFormatter
            dynamicRank={item.dynamicRank}
            originRank={item.originRank}/>
        </td>
        <td>
          <FireBox adIndexer={item.adIndexer}/>
        </td>
        {this.props.client.userName==='admin'&&<td>{item.todayPolishedCount}</td>}
        <td>{this.stringFormat(item.isValid && item.shield != 1)}</td>
        <td>{this.statusFormat(item.status)}</td>

        <td>
          <Link
            title="排名历史"
            to={`/analysis/${item._id}`}
            role="button"
            className="btn btn-info btn-sm">
            <FontAwesomeIcon icon={faSignal} size='1x'/>
          </Link>
        </td>
        <td>
          <button
            title="删除"
            className="btn btn-danger btn-sm"
            onClick={(e) => {
            if (typeof this.props.onDelete === 'function') {
              this
                .props
                .onDelete(item, e)
            }
          }}>
          <FontAwesomeIcon icon={faTrash} size='1x'/>
          </button>{" "}
          <button
            title="重置"
            className="btn btn-warning btn-sm"
            onClick={(e) => {
            if (typeof this.props.onReset === 'function') {
              this
                .props
                .onReset(item, e)
            }
          }}>
            <i className="fa fa-undo"/>
            <FontAwesomeIcon icon={faUndo} size='1x'/>

          </button>{" "}
          <Switch on={item.status == 1} onClick={(e) => this.props.toggleSwitch(item,e)}/>
        </td>
      </tr>
    );
  }
}