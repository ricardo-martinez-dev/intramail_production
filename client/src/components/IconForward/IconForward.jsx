import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

class IconForward extends React.Component {
  render() {
    const { onForwardMessage } = this.props.functions;
    const { msg } = this.props.properties.readMessage;

    return (
      <li onClick={() => onForwardMessage(msg)}>
        <span>
          <FontAwesomeIcon icon={faShare} />
        </span>
        <span id="info">forward</span>
      </li>
    );
  }
}

export default IconForward;
