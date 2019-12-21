import React from 'react'

export default class RankDifferenceFormatter extends React.Component {
  render() {

    const {dynamicRank, originRank} = this.props;
    let color = "green",
      diffText = "-";
    if (dynamicRank === 0 || originRank === 0 || dynamicRank === -1) {
      color = "black";
    } else {
      var diff = originRank - dynamicRank;
      if(originRank === -1){
        diff = 121 - dynamicRank;
      }
      if (diff > 0) {
        diffText = "+" + diff;
      } else if (diff === 0) {
        color = "black";
        diffText = diff;
      } else {
        color = "red";
        diffText = diff;
      }
    }
    return <span style={{
      color: color,
      fontWeight: "bold"
    }}>{diffText}</span>;
  }
}