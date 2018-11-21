import React, {Component} from 'react'
import DatePicker from 'react-datepicker';
import Select from 'react-select'
import {userStatusList, userGradeList} from './constants'
import moment from 'moment'
import {Form, FormGroup, FormControl, Button} from 'react-bootstrap'

export default class UserQuery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            startDate: moment().subtract("days", 360),
            endDate: moment(),
            status: {
                label: '在线',
                value: 1
            }, //0 all, 1 online, 2 offline
            grade: 0 //0 all, 1 free, 2 vip, 3 enterprise, 4 unknown
        }
        console.log('startDate', this.state.startDate.format('YYYY-MM-DD'))
        this.query()
    }

    query() {
        if (this.props.query) {
            this
                .props
                .query({
                    startDate: this
                        .state
                        .startDate
                        .format('YYYY-MM-DD'),
                    endDate: this
                        .state
                        .endDate
                        .format('YYYY-MM-DD'),
                    status: this.state.status.value,
                    name: this.state.name,
                    grade: this.state.grade.value
                })
        }
    }

    render() {
        return (

            <Form inline>
                <FormGroup>
                    <Select
                        styles={{
                        control: () => ({width: 150})
                    }}
                        placeholder="用户状态"
                        value={this.state.status}
                        onChange={(status) => {
                        this.setState({status})
                    }}
                        options={userStatusList}/>
                    <Select
                        styles={{
                        control: () => ({width: 150})
                    }}
                        placeholder="用户类型"
                        value={this.state.grade}
                        onChange={(grade) => {
                        this.setState({grade})
                    }}
                        options={userGradeList}/>
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
                    <FormControl
                        type="text"
                        value={this.state.name}
                        placeholder={"用户名称"}
                        onChange={(e) => {
                        this.setState({name: e.target.value})
                    }}/>
                    <Button
                        bsStyle="primary"
                        onClick={this
                        .query
                        .bind(this)}>查询</Button>
                </FormGroup>
            </Form>
        )
    }
}
