import React from "react";

class NewMessageBody extends React.Component {
  render() {
    const { onChange, message } = this.props;

    return (
      <div id="message">
        <textarea
          name="message"
          value={message}
          onChange={(e) => onChange(e)}
        ></textarea>
      </div>
    );
  }
}

export default NewMessageBody;
