import React from "react";
import IconEnvelope from "../IconEnvelope/IconEnvelope";
import IconForward from "../IconForward/IconForward";
import IconReply from "../IconReply/IconReply";
import IconTrash from "../IconTrash/IconTrash";

class MessageButtons extends React.Component {
  render() {
    const { functions, properties } = this.props;
    const { msg } = this.props.properties.readMessage;

    return (
      <>
        {msg && (
          <div id="msg-buttons">
            <ul>
              <IconEnvelope functions={functions} properties={properties} />
              <IconReply properties={properties} functions={functions} />
              <IconForward properties={properties} functions={functions} />
              <IconTrash functions={functions} msg={msg} />
            </ul>
          </div>
        )}
      </>
    );
  }
}

export default MessageButtons;
