import React from 'react';
import {Link, withRouter} from 'react-router';
import Select from "react-select";
import {Alert} from 'reactstrap'

class QueryBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      showDescription: false,
      expanded: false,
      displayedQuestions: [],
      topics: [],
      showAlert:false
    };
    this.askQuestion = this
      .askQuestion
      .bind(this);
    this.filterQuestions = this
      .filterQuestions
      .bind(this);
    this.toggleExpand = this
      .toggleExpand
      .bind(this);
    this.toggleDescriptionField = this
      .toggleDescriptionField
      .bind(this);
  }

  componentDidMount() {
    this.setState({expanded: false});
  }

  askQuestion(e) {
    e.preventDefault();
    const question = this.state;
    if(question.title.length <10){
      this.setState({'showAlert':true})
      this.refs.title.focus();
      return;
    }
    this.setState({'showAlert':false})
    this
      .props
      .createQuestion(question)
      .then(action => {
        this
          .props
          .history
          .push(`/qa/${action.question._id}`);
      });
  }

  filterQuestions() {
    let searchTerm = this.state.title;
    let displayedQuestions = this
      .props
      .questions
      .filter((question) => {
        return question
          .title
          .includes(searchTerm);
      });
    this.setState({displayedQuestions: displayedQuestions});
  }

  clear(field) {
    return e => this.setState({[field]: ""});
  }

  update(field) {
    return e => {
      this.setState({
        [field]: e.currentTarget.value
      }, this.filterQuestions);
    };
  }

  toggleExpand(event) {
    event.preventDefault();
    this.setState({
      expanded: !this.state.expanded
    });
  }

  toggleDescriptionField() {
    this.setState({
      showDescription: !this.state.showDescription
    });
  }
  onSelect(options) {
    console.log('onselect', options)
    this.setState({
      topics: options.map(x => x.value)
    })
  }

  handleDismiss() {
    this.setState({ showAlert: false });
  }

  handleShow() {
    this.setState({ showAlert: true });
  }

  render() {
    let descriptionField = "";
    if (this.state.showDescription) {
      descriptionField = <textarea
        rows="3"
        className="description-field"
        type="text"
        className="form-control"
        onChange={this.update("description")}/>;
    }
    if (this.state.expanded) {
      return (
        <div className="expanded-query-bar-container">
          <form className="expanded-query-bar" onSubmit={this.askQuestion.bind(this)} onClick={null}>
            <div className="expanded-ask-bar">
              {this.state.showAlert&&<Alert color="danger">不能为空或字数太少</Alert>}
              <textarea rows="1" onChange={this.update("title")} className="form-control" ref='title'/> {descriptionField}
              <Select
                placeholder="标签"
                onChange={this
                .onSelect
                .bind(this)}
                options={this
                  .props
                  .topics
                  .map(x => {
                    return {label: x, value: x}
                  })}
                 isMulti/>
              <ul className="search-results">
                {this
                  .state
                  .displayedQuestions
                  .map((question) => <li key={question.id}>
                    <a href={"/#/" + question.id}>{question.title}</a>
                  </li>)}
              </ul>
            </div>
            <div className="expanded-tool-bar">
              <input type="submit" value="提交" className="btn btn-primary"/>
              <input type="button" value="取消" className="btn btn-default" onClick={this.toggleExpand}/>
              <button
                type="button"
                className="btn btn-link"
                onClick={this.toggleDescriptionField}>增加描述</button>
            </div>
          </form>

          <div className="grey-modal" onClick={this.toggleExpand}/>
        </div>

      );
    }
    return (
      <div className="d-flex justify-content-between align-items-center w-100">
        <strong className="text-gray-dark"></strong>
        <a href="#" onClick={this.toggleExpand.bind(this)}>我要提问</a>
      </div>
    );

  }
}

export default QueryBar