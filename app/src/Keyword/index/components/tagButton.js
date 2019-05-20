import React from 'react'
import Dialog from "~/src/Components/Modals/Dialog";
import Select from 'react-select'
import {RowContainer} from "~/src/Components/Forms/RowContainer";
import {withRouter} from 'react-router-dom'

class TagButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: []
    }
  }

  selectedKeywords() {
    return Object
      .values(this.props.keywords)
      .filter(x => x.selected)
  }

  onTag() {
    var ids = this
      .selectedKeywords()
      .map(x => x._id);
    if (ids.length == 0) {
      this
        .props
        .history
        .push({
          pathname: '/tag/create',
          state: {
            catelog: 'keyword'
          }
        })
    } else {
      this
        .refs
        .dialog
        .show({
          title: '设置标签',
          body: this.dialogContentRender(),
          actions: [
            Dialog.CancelAction(() => {
              console.log("dialog cancel");
            }),
            Dialog.OKAction(() => {
              if (this.state.tags.length == 0) 
                return;
              this
                .props
                .keywordsTagUpdate(ids, this.state.tags)
            })
          ]
        })
    }
  }

  keywordsRender() {
    return (this.selectedKeywords().map((x, index) => {
      return <span key={index} className="badge badge-pill badge-primary">
        {x.keyword}
      </span>
    }))

  }

  onSelect(options) {
    this.setState({
      tags: options.map(x => x.value)
    })
  }

  dialogContentRender() {
    return (
      <React.Fragment>
        <RowContainer>
          {this.keywordsRender()}
        </RowContainer>
        <RowContainer label="标签">
          <Select
            placeholder="标签"
            onChange={this
            .onSelect
            .bind(this)}
            options={this
            .props
            .tags['keyword']
            .map(x => {
              return {label: x, value: x}
            })}
            isMulti/>
        </RowContainer>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        <Dialog ref={"dialog"}/>
        <button
          className="btn btn-secondary btn-sm"
          onClick={this
          .onTag
          .bind(this)}>
          标签
        </button>
      </React.Fragment>

    )

  }
}

export default withRouter(TagButton)