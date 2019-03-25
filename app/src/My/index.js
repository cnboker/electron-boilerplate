import React, {
  Component
} from 'react'

import Profile from './profile'
import Price from './price'
import { connect } from "react-redux";
import { toast } from "react-toastify";
import axiox from "axios";

class Index extends Component {

  render() {
    const authenticated = localStorage.getItem("token") != undefined;
    const {profile} = this.props.client;
    if (profile.gradeValue > 1) {
      return <Profile model={profile}/>
    } else {
      return <Price />
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return { client: state.client };
};

//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(Index);
