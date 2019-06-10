import React from 'react'
import PropTypes from 'prop-types'
import LocalizedStrings from 'react-localization'
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


const Messages = (props) => {
  const { messages } = props
  return (
    <div>
      
        {
          messages.map(message => (
            <span key={message.time} className="badge badge-success">{resources[message.body]?resources[message.body]:message.body}</span>
          ))
        }
      
    </div>
  )
}

Messages.PropTypes = {
  messages:PropTypes.arrayOf(
    PropTypes.shape(
      {
        body:PropTypes.string,
        time:PropTypes.date,
      }
    )
  )
}

export default Messages