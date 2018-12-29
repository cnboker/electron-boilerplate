import React, {Component} from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import {Form, FormGroup, FormControl, Button, Checkbox} from "react-bootstrap";

export default class Query extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      startDate: moment().add(-30, 'days'),
      endDate: moment().add(1, 'days'),
      status: false
    };
    this.query();
  }

  query() {
    if (this.props.query) {
      this
        .props
        .query({
          startDate: this
            .state
            .startDate
            .format("YYYY-MM-DD"),
          endDate: this
            .state
            .endDate
            .format("YYYY-MM-DD"),
          name: this.state.name,
          status: this.state.status
            ? 1
            : 0
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
            this.setState({startDate: date});
          }}/>{" "}
          <DatePicker
            className="form-control"
            selected={this.state.endDate}
            onChange={date => {
            this.setState({endDate: date});
          }}/>{" "}
          <FormControl
            type="text"
            value={this.state.name}
            placeholder={"推荐人"}
            onChange={e => {
            this.setState({name: e.target.value});
          }}/>
          <Checkbox
            checked={this.state.status}
            onChange={e => {
            this.setState({status: e.target.checked})
          }}>已付款</Checkbox>
          <Button
            bsStyle="primary"
            onClick={this
            .query
            .bind(this)}>
            查询
          </Button>
        </FormGroup>
      </Form>
    );
  }
}
