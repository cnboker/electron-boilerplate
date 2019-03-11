import React from 'react'

export default class FireBox extends React.Component {
  render() {
    const {adIndexer} = this.props;

    if (adIndexer == undefined) 
      return <span>-</span>
    var indexer = item.adIndexer;
    if (indexer > 0) {
      return [...Array(adIndexer)].map((e, i) => {
        return <i className="fa fa-diamond " style={{
          color: 'red'
        }}/>
      })
    } else {
      return <span>0</span>
    }
  }
}