import React from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'

class ListContainer extends React.Component{
  constructor(props){
    super(props)
  }
  this.state ={
    data:this.products.slice(0,this.props.sizePerPage),
    totalDataSize:this.
  }
}

class ListTable extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <BootstrapTable
        data={this.props.data}
        remote={true}
        pagination={true}
        fetchInfo={dataTotalSize : this.props.totalDataSize}
        options={{
        onSortChange: this.props.onSortChange,
        sizePerPage: this.props.sizePerPage,
        onPageChange: this.props.onPageChange,
        sizePerPageList: [
          30, 50
        ],
        page: this.props.currentPage,
        onSizePerPageList: this.props.onSizePerPageList
      }}>
        <TableHeaderColumn dataField='id' , isKey={true}></TableHeaderColumn>
        <TableHeaderColumn dataField="keyword">关键词</TableHeaderColumn>
        <TableHeaderColumn dataField="link">匹配网址</TableHeaderColumn>
        <TableHeaderColumn dataField="originRank" dataFormat={stringFormat}>初始排名</TableHeaderColumn>
        <TableHeaderColumn dataField="dynamicRank" dataFormat={stringFormat}>最新排名</TableHeaderColumn>
        <TableHeaderColumn dataField="" dataFormat={getDiff}>变化</TableHeaderColumn>
        <TableHeaderColumn dataField="" dataFormat={getFire}>商业热度</TableHeaderColumn>
        <TableHeaderColumn dataField="" dataFormat={isValid}>有效</TableHeaderColumn>
        <TableHeaderColumn dataField="status" dataFormat={statusFormat}>状态</TableHeaderColumn>
        <TableHeaderColumn dataField="">跟踪</TableHeaderColumn>
      </BootstrapTable>
    )
  }
}