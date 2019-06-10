import PropTypes from 'prop-types'

const If = (props) => {

  if (props.test) {
    return props.children
  } else {
    return false
  }

}
If.PropTypes ={
  test:PropTypes.bool
}
export default If