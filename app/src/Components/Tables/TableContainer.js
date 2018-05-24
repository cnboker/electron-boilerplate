import React from 'react'
import PropTypes from 'prop-types'

const TableContainer = (props) => {
  const {
    title,
    children
  }=props

  return (
    
      <div className="row">
       
          <div className="card" >
            <div className="card-header">
              <i className="fa fa-align-justify"></i> {title}
              </div>
            <div className="card-block">
              {children}
            </div>
          
        </div>
      </div>
  
  )
}
TableContainer.propTypes ={
  title:PropTypes.string,
  children:PropTypes.node
}
export default TableContainer