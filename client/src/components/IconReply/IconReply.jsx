import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import React from "react";

class IconReply extends React.Component {
  render() {
    const { onAnswerMessage } = this.props.functions;
    const { msg, action } = this.props.properties.readMessage;
    return (
      <>
        {msg && action === "received" && (
          <li onClick={() => onAnswerMessage(msg)}>
            <span>
              <FontAwesomeIcon icon={faReply} />
            </span>
            <span id="info">reply</span>
          </li>
        )}
      </>
    );
  }
}

export default IconReply;
