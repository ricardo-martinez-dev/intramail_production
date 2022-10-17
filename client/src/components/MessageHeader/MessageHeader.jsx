import React from "react";

class MessageHeader extends React.Component {
  render() {
    const { msg, sender, receiver, action } = this.props.properties.readMessage;

    return (
      <div id="header">
        <ul>
          {action === "sent" ? (
            <li>
              <span>To: </span>
              <span className="capitalize">
                {receiver && receiver.fname} {receiver && receiver.lname}
              </span>
            </li>
          ) : (
            <li>
              <span>From: </span>
              <span className="capitalize">
                {sender && sender.fname} {sender && sender.lname}
              </span>
            </li>
          )}

          <li>
            <span>Subject: </span>
            <span>{msg && msg.subject}</span>
          </li>

          <li>
            <span>Date: </span>
            <span>{msg && new Date(msg.timestamp).toLocaleString()}</span>
          </li>
        </ul>
      </div>
    );
  }
}

export default MessageHeader;
