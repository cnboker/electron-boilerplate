import React from 'react'

export const renderField = ({
  input,
  label,
  type,
  meta:{touched,error,warning},
  ...props
}) => (
 
  <div className="form-group row">
    <label className="col-md-3 from-control-label">{label}</label>
    <div className="col-md-9">
      <input {...input} {...props}  className="form-control" type={type}/>
      {touched && error && <span className="help-block ">{error}</span>}
    </div>
  </div>
)


