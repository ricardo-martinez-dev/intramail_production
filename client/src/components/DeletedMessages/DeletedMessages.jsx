import "./style.css";
import React from "react";
import ReceivedMessages from "../ReceivedMessages/ReceivedMessages";
import SectionToggle from "../SectionToggle/SectionToggle";
import SentMessages from "../SentMessages/SentMessages";

class DeletedMessages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sections: ["received"],
      currentSection: "received",
    };
  }

  toggleSection = (currentSection) => {
    this.setState({ currentSection });
  };

  render() {
    const { currentSection } = this.state;
    const {} = this.props.functions;

    const functions = {
      ...this.props.functions,
      onToggleSection: this.toggleSection,
    };

    const properties = { ...this.props.properties, isDeleted: true };

    return (
      <div
        id="headers"
        style={{
          zIndex: properties.currentShown === "deleted" ? "99999999" : "0",
        }}
      >
        <div id="container">
          <h2>Deleted Messages</h2>

          <div id="message-headers">
            <SectionToggle properties={this.state} functions={functions} />

            {currentSection === "sent" && (
              <SentMessages properties={properties} functions={functions} />
            )}

            {currentSection === "received" && (
              <ReceivedMessages properties={properties} functions={functions} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DeletedMessages;
