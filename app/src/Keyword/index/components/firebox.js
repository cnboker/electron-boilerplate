import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faGem } from "@fortawesome/free-solid-svg-icons";

export default class FireBox extends React.Component {
  htmlRender() {
    const { adIndexer } = this.props;
    if (adIndexer == undefined) return <span>-</span>;
    if (adIndexer > 0) {
      return [...Array(adIndexer)].map((e, i) => {
        return (
          <FontAwesomeIcon icon={faGem}
            key={i}
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
