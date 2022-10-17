import axios from "axios";
import React from "react";
import MessageBody from "../MessageBody/MessageBody";
import MessageButtons from "../MessageButtons/MessageButtons";
import MessageHeader from "../MessageHeader/MessageHeader";

class MessageReader extends React.Component {
  handleDeleteMessage = async (obj) => {
    const { id } = obj;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/messages/msg/${id}`;
    await axios
      .put(url)
      .then((res) => res)
      .catch((err) => console.log(err));
  };

  render() {
    const { properties } = this.props;

    const functions = {
      ...this.props.functions,
      onDeleteMessage: this.handleDeleteMessage,
    };

    return (
      <div
        id="message-reader"
        style={{
          display:
            properties.currentShown === "messageReader" ||
            (properties.currentShown !== "messageReader" &&
              window.innerWidth > 768)
              ? "flex"
              : "none",
        }}
      >
        <MessageHeader functions={functions} properties={properties} />

        <div id="body">
          <MessageButtons functions={functions} properties={properties} />
          <MessageBody functions={functions} properties={properties} />
        </div>
      </div>
    );
  }
}

export default MessageReader;
