import React, {
  Component
} from 'react'
import {
  Link
} from 'react-router-dom'
import Profile from './profile'
import Price from './price'
import { connect } from "react-redux";
import { toast } from "react-toastify";
import axiox from "axios";
class Index extends Component {
  constructor() {
    super();
    this.state = {
      profile: {
        grade: "",
        userName: "",
        expiredDate: Date.now(),
        balance: []
      }
    };
  }

  componentDidMount() {
    console.log(this.props.client);
    var $this = this;
    const url = `${process.env.REACT_APP_API_URL}/profile`;
    axiox({
      url,
      headers: {
        Authorization: `Bearer ${this.props.client.token.access_token}`
      }
    })
      .then(function(res) {
        $this.setState({
          profile: res.data
        });
        $this.forceUpdate()
      })
      .catch(function(e) {
        toast.error(e.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      });
  }

  render() {
    const authenticated = localStorage.getItem("token") != undefined;
    if (this.state.profile.gradeValue > 1) {
      return <Profile model={this.state.profile}/>
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
