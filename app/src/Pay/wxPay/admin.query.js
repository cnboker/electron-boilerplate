import React, {Component} from 'react'
import DatePicker from 'react-datepicker';
import Select from 'react-select'
import moment from 'moment'
import {Form, FormGroup, Input, Button,Label} from 'reactstrap'

export default class AdminListQuery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      startDate: moment().subtract("days", 30),
      endDate: moment().add('days', 1),
      status: 0 //是否已确认
    }
  }

  componentDidMount() {
    this.query();
  }

  query() {
    if (this.props.onSelect) {
      this
        .props
        .onSelect({
          startDate: this
            .state
            .startDate
            .format('YYYY-MM-DD'),
          endDate: this
            .state
            .endDate
            .format('YYYY-MM-DD'),
            status: this.state.status,
          name: this.state.name
        })
    }
  }

  render() {
    return (

      <Form inline>
        <FormGroup>

          <DatePicker
            className="form-control"
            selected={this.state.startDate}
            onChange={(date) => {
            this.setState({startDate: date})
          }}/>{" "}
          <DatePicker
            className="form-control"
            selected={this.state.endDate}
            onChange={(date) => {
            this.setState({endDate: date})
          }}/>{" "}
          <Input
            type="text"
            value={this.state.name}
            placeholder={"用户名称"}
            onChange={(e) => {
            this.setState({name: e.target.value})
          }}/>
          <Label>
            已确认
            <Input
              type="checkbox"
              checked={this.state.confirm}
              onChange={e => {
              this.setState({status: e.target.checked?1:0})
            }}></Input>
          </Label>
          <Button onClick={this
            .query
            .bind(this)}>查询</Button>
        </FormGroup>
      </Form>
    )
  }
}
