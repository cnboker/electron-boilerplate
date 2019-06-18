import React, { Component } from "react";
import Select from "react-select";
import { StatusList } from "./constants";
import { Form, FormGroup, Input, Button } from "reactstrap";

export default class UserQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      status: {
        label: "全部",
        value: -1
      } //0 all, 1 online, 2 offline
    };
    this.query();
  }

  query() {
    if (this.props.query) {
      this.props.query({
        status: +this.state.status.value,
        name: this.state.name
      });
    }
  }

  render() {
    return (
      <Form inline>
        <FormGroup>
          <Select
            styles={{
              control: () => ({ width: 150 })
            }}
            placeholder="状态"
            value={this.state.status}
            onChange={status => {
              this.setState({ status });
            }}
            options={StatusList}
          />{" "}
          <Input
            type="text"
            value={this.state.name}
            placeholder={"用户名称"}
            onChange={e => {
              this.setState({ name: e.target.value });
            }}
          />
          <Button onClick={this.query.bind(this)}>查询</Button>
        </FormGroup>
      </Form>
    );
  }
}
