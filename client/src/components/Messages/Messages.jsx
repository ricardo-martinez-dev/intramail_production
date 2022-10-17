import React from "react";
import ReceivedMessages from "../ReceivedMessages/ReceivedMessages";
import SectionToggle from "../SectionToggle/SectionToggle";
import SentMessages from "../SentMessages/SentMessages";

class Messages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sections: ["received", "sent"],
      currentSection: "received",
    };
  }

  toggleSection = (currentSection) => {
    this.setState({ currentSection });
  };

  render() {
    const { currentSection } = this.state;
    const { onShowNewMessage, onCurrentShown } = this.props.functions;

    const functions = {
      ...this.props.functions,
      onToggleSection: this.toggleSection,
    };

    const properties = { ...this.props.properties, isDeleted: false };

    return (
      <div
        id="headers"
        style={{
          zIndex: properties.currentShown === "messages" ? "99999999" : "0",
        }}
      >
        <div id="container">
          <h2>Messages</h2>

          <button
            id="new-message"
            onClick={() => {
              onShowNewMessage();
              onCurrentShown("newMessage");
            }}
          >
            New Message
          </button>

          <div id="message-headers">
            <SectionToggle properties={this.state} functions={functions} />

            {currentSection === "sent" && (
              <SentMessages properties={properties} functions={functions} />
            )}

            {currentSection === "received" && (
              <ReceivedMessages
                properties={this.props.properties}
                functions={functions}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Messages;
