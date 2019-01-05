import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import {
  Form,
  FormGroup,
  FormControl,
  Button,
  Checkbox
} from "react-bootstrap";

export default class Query extends Component {
  constructor(props) {
    super(props);
   
    this.state = {
      name: "",
      startDate: moment().add('days',-90),
      endDate: moment().add('days',1),
      actived: false
    };
  }

  query() {
    if (this.props.query) {
      this.props.query({
        startDate: this.state.startDate.format("YYYY-MM-DD"),
        endDate: this.state.endDate.add(1,'days').format("YYYY-MM-DD"),
        name: this.state.name,
        actived:this.state.actived
      });
    }
  }

  render() {
    return (
      <Form inline>
        <FormGroup>
          <DatePicker
            className="form-control"
            selected={this.state.startDate}
            onChange={date => {
              this.setState({ startDate: date });
            }}
          />{" "}
          <DatePicker
            className="form-control"
            selected={this.state.endDate}
            onChange={date => {
              this.setState({ endDate: date });
            }}
          />{" "}
          <FormControl
            type="text"
            value={this.state.name}
            placeholder={"代理商"}
            onChange={e => {
              this.setState({ name: e.target.value });
            }}
          />
          <Checkbox
            checked={this.state.actived}
            onChange={e=>{
                this.setState({actived:e.target.checked})
            }}
          >已激活</Checkbox> 
          <Button bsStyle="primary" onClick={this.query.bind(this)}>
            查询
          </Button>
        </FormGroup>
      </Form>
    );
  }
}
