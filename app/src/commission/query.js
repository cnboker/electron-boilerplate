import React, {Component} from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import {Form, FormGroup, Input, Button, Label} from "reactstrap";

export default class Query extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      startDate: moment().add('days', -90),
      endDate: moment().add('days', 1),
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
          <Input
            type="text"
            value={this.state.name}
            placeholder={"推荐人"}
            onChange={e => {
            this.setState({name: e.target.value});
          }}/>
          <Label check>
            <Input
              type="checkbox"
              checked={this.state.status}
              onChange={e => {
              this.setState({status: e.target.checked})
            }}></Input>{' '}已付款</Label>

          <Button onClick={this
            .query
            .bind(this)}>
            查询
          </Button>
        </FormGroup>
      </Form>
    );
  }
}
