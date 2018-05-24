import React from 'react'
import classNames from 'classnames'
import LocalizedStrings from 'react-localization'
import Cookies from "js-cookie"

const resources = new LocalizedStrings({
  en: {
    Required: 'Required',
    InvalidEmail: 'Invalid email address',
    MustBeNCharacters:'Must be {0} characters or more',
    MustLessNCharacters: 'Must be {0} characters or less',
    MustBeNumber:'Must be a number'
  },
  zh: {
    Required: '必填项',
    InvalidEmail: '邮件地址格式不正确',
    MustBeNCharacters:'至少{0}个字符',
    MustLessNCharacters: '必须小于{0}个字符',
    MustBeNumber:'必须是数字'
  }
})
var language = Cookies.get('language') || resources.getLanguage()    
resources.setLanguage(language)

export const required = value => (value ? undefined : resources.Required)
const maxLength = max => value =>
  value && value.length > max ? resources.formatString(resources.MustLessNCharacters,max)  : undefined
  
export const maxLength15 = maxLength(15)

export const minLength = min => value =>
  value && value.length < min ? resources.formatString(resources.MustBeNCharacters,min) : undefined

export const minLength6 = minLength(6)

export const number = value =>
  value && isNaN(Number(value)) ? resources.MustBeNumber : undefined

export const minValue = min => value =>
  value && value < min ? `Must be at least ${min}` : undefined
  
export const minValue18 = minValue(18)

export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? resources.InvalidEmail
    : undefined

export const tooOld = value =>
  value && value > 65 ? 'You might be too old for this' : undefined

export const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined

export const phoneNumber = value =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined

export const renderField = ({
  input,
  label,
  type,
  placeholder,
  labelIcon,
  meta: { touched, error, warning }
}) => (
    <div className={classNames('mb-3', { 'has-error': error, 'has-warning': warning })}>
      <div className="input-group">
        <span className="input-group-addon">
        {(labelIcon&&<i className={labelIcon}></i>)}
        {(label&&<span>{label}</span>)}
        </span>
        <input {...input} className="form-control" type={type} placeholder={placeholder}/>
      </div>
      {touched && ((error && <span className="help-block">{error}</span>) || (warning && <span class="help-block">{warning}</span>))}

    </div>
  )