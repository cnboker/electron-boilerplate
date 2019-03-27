import React, {
  Component
} from 'react'

import ProfileComponent from './profile'
import Price from './price'
import { connect } from "react-redux";
import { toast } from "react-toastify";
import axiox from "axios";
import {fetchProfile} from '~/src/Profile/action'

class Index extends Component {
  componentDidMount(){
    this.props.fetchProfile();
  }

  render() {
    const authenticated = localStorage.getItem("token") != undefined;
    const {profile} = this.props;
    if (profile.gradeValue > 1) {
      return <ProfileComponent model={profile}/>
    } else {
      return <Price />
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return { client: state.client,profile:state.userProfile };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchProfile:()=>{
      dispatch(fetchProfile())
    }
   
  }
}
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps,mapDispatchToProps)(Index);
