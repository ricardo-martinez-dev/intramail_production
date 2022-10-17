import { faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

class NewMessageButtons extends React.Component {
  state = {};
  render() {
    const { onHideNewMessage } = this.props.functions;
    const { message, receiver, subject } = this.props.foo;
    const { onSend, onDelete } = this.props;

    const isFormValid =
      message !== "" && receiver !== "" && subject !== "" ? true : false;

    return (
      <div id="msg-buttons">
        <ul>
          <li
            style={{
              color: isFormValid ? "#06af06" : "#000",
            }}
            onClick={() => {
              onSend();

              const { message, receiver, subject } = this.props.foo;
              const isFormValid =
                message !== "" && receiver !== "" && subject !== ""
                  ? true
                  : false;

              // ---------------------------------------------------------//
              // ------------------- DELETED CODE HERE -------------------//
              // ---------------------------------------------------------//

              if (!isFormValid) alert("No field can be empty!");
              else if (!isEmail) alert("You have typed a wrong email!");
              else onHideNewMessage();
            }}
          >
            <span>
              <FontAwesomeIcon icon={faPaperPlane} />
            </span>
            <span id="info">send</span>
          </li>
          <li
            style={{
              color: isFormValid ? "#af0630" : "#000",
            }}
            onClick={() => onDelete()}
          >
            <span>
              <FontAwesomeIcon icon={faTrash} />
            </span>
            <span id="info">delete</span>
          </li>
        </ul>
      </div>
    );
  }
}

export default NewMessageButtons;
