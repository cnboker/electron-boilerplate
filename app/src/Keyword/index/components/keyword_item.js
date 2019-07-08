import React from "react";
import FireBox from "./firebox";
import RankDifferenceFormatter from "./rankDifferenceFormatter";
import { Link } from "react-router-dom";
import { Switch } from "~/src/Components/Forms/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSignal, faUndo } from "@fortawesome/free-solid-svg-icons";
import { stringFormat, isValidDate, statusFormat } from "./util";
import { toast } from "react-toastify";

export default class KeywordItem extends React.Component {
  constructor() {
    super();
    this.state = { selected: false };
  }

  componentDidUpdate(previousProps) {
    if (previousProps.data !== this.props.data) {
      this.setState({ selected: false });
    }
  }

  selected(item, e) {
    this.setState({ selected: e.target.checked });
    item.selected = e.target.checked;
  }

  render() {
    const item = this.props.data;
    return (
      <tr key={item._id}>
        <td>
          <input
            type="checkbox"
            checked={item.selected}
            onClick={this.selected.bind(this, item)}
          />
        </td>
        <td
          style={{
            overflow: "hidden",
            whiteSpace: "initial"
          }}
        >
          <a
            target="_blank"
            href={`https://www.baidu.com/s?wd=${item.keyword }`}
          
          >
            {item.keyword}
          </a>
        </td>
        <td>{item.link}</td>
        <td>{stringFormat(item.originRank)}</td>
        <td>{stringFormat(item.dynamicRank)}</td>
        <td>
          <RankDifferenceFormatter
            dynamicRank={item.dynamicRank}
            originRank={item.originRank}
          />
        </td>
        <td>
          <FireBox adIndexer={item.adIndexer} />
        </td>
        <td>{stringFormat(item.resultIndexer)}</td>
        {this.props.client.userName === "admin" && (
          <td>{item.todayPolishedCount}</td>
        )}
        <td>{stringFormat(item.isValid && item.shield != 1)}</td>
        <td>{statusFormat(item.status)}</td>

        <td>
          <Link
            title="排名历史"
            to={`/analysis/${item._id}`}
            role="button"
            className="btn btn-info btn-sm"
          >
            <FontAwesomeIcon icon={faSignal} size="1x" />
          </Link>
        </td>
        <td>
          <button
            title="删除"
            className="btn btn-danger btn-sm"
            onClick={e => {
              if (typeof this.props.onDelete === "function") {
                this.props.onDelete(item, e);
              }
            }}
          >
            <FontAwesomeIcon icon={faTrash} size="1x" />
          </button>{" "}
          <button
            title="重置"
            className="btn btn-warning btn-sm"
            onClick={e => {
              if (typeof this.props.onReset === "function") {
                this.props.onReset(item, e);
              }
            }}
          >
            <i className="fa fa-undo" />
            <FontAwesomeIcon icon={faUndo} size="1x" />
          </button>{" "}
          <Switch
            on={item.status == 1}
            onClick={e => {
              this.props.toggleSwitch(item, e);
            }}
          />
        </td>
      </tr>
    );
  }
}
