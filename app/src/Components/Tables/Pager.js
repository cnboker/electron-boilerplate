import ReactPaginate from 'react-paginate'
import React from 'react'
import { renderComponent } from 'recompose';


export default class Pager extends React.Component{
  render(){
    return (
      <ReactPaginate
      previousLabel={"上一页"}
      nextLabel={"下一页"}
      breakLabel={<a href = "" > ...</a>}
      breakClassName={"break-me"}
      pageCount={this.props.pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={(e)=>this.props.onPageChange(e)}
      containerClassName={"pagination"}
      subContainerClassName={"pages pagination"}
      activeClassName={"active"}/>
    )
  }
}