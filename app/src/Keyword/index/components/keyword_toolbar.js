import React from 'react'
import {Link} from 'react-router-dom'
import CVSExport from './keyword_export'

export default  (props) => {
  return (
    <React.Fragment>
      <Link
        to={{
        pathname: "/tag/create",
        state: {
          catelog: 'keyword'
        }
      }}
        className="btn btn-secondary">
        标签
      </Link>{" "}
      <Link to={"/keyword/new"} role="button" className="btn btn-success">
        新建
      </Link>{" "}
      <button
        id="pageRefresh"
        onClick={() => {
          props
          .findAllKeywords();
      }}
        role="button"
        className="btn btn-info">
        刷新
      </button>{" "}
      <button
        onClick={props.onSelectedDelete}
        role="button"
        className="btn btn-danger">
        批量删除
      </button>{" "}
      <button
        onClick={props.onSelectedReset}
        role="button"
        className="btn btn-warning">
        批量重置
      </button>{" "}
      <CVSExport keywords={props.keywords}/>
    </React.Fragment>
  )
}