import React from "react";

export default class FireBox extends React.Component {
  htmlRender() {
    const { adIndexer } = this.props;
    if (adIndexer == undefined) return <span>-</span>;
    if (adIndexer > 0) {
      return [...Array(adIndexer)].map((e, i) => {
        return (
          <i
            key={i}
            className="fa fa-diamond "
            style={{
              color: "red"
            }}
          />
        );
      });
    } else {
      return <span>0</span>;
    }
  }

  render() {
    return <div>{this.htmlRender()}</div>;
  }
}
