import React from 'react'
import {Link} from 'react-router-dom'
import CVSExport from './keyword_export'
import TagButton from './tagButton'

export default  (props) => {
  return (
    <React.Fragment>
      <TagButton {...props}/>
    {" "}
      <Link to={"/keyword/new"} role="button" className="btn btn-success  btn-sm">
        新建
      </Link>{" "}
      <button
        id="pageRefresh"
        onClick={() => {
          props
          .findAllKeywords();
      }}
        role="button"
        className="btn btn-info  btn-sm">
        刷新
      </button>{" "}
      <button
        onClick={props.onSelectedDelete}
        role="button"
        className="btn btn-danger btn-sm">
        批量删除
      </button>{" "}
      <button
        onClick={props.onSelectedReset}
        role="button"
        className="btn btn-warning btn-sm">
        批量重置
      </button>{" "}
      <CVSExport keywords={props.keywords}/>
    </React.Fragment>
  )
}