import React from 'react'
import LocalizedStrings from 'react-localization'
import PropTypes from 'prop-types'
import Cookies from "js-cookie"

const resources = new LocalizedStrings({
  en: {
    Invalid_username_or_password: 'Invalid username or password.',

  },
  zh: {
    Invalid_username_or_password: '无效的用户或密码',
 
  }
})
var language = Cookies.get('language') || resources.getLanguage()    
resources.setLanguage(language)

const Errors = (props) => {
  const { errors } = props
  return (
    <div>
      {
        errors.map(error => (
          <span key={error.time} className="badge badge-danger">{resources[error.body]?resources[error.body]:error.body}</span>
          ))
      }
    </div>
  )
}

Errors.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape(
      {
        body: PropTypes.string,
        time: PropTypes.date,
      }
    )
  )
}

export default Errors