import React from "react";

class MessageBody extends React.Component {
  render() {
    const { msg } = this.props.properties.readMessage;

    return (
      <>
        {msg && (
          <div id="message">
            {msg &&
              msg.message.split("\n").map((el, i) => {
                if (el.includes("<<<<< >>>>>")) {
                  return null;
                }

                const date = new Date(el).toLocaleString();

                if (date.toLowerCase() != "invalid date") {
                  return {
                    // ---------------------------------------------------------//
                    // ------------------- DELETED CODE HERE -------------------//
                    // ---------------------------------------------------------//
                  };
                } else {
                  return (
                    <p className="parag" key={i}>
                      {el}
                    </p>
                  );
                }
              })}
          </div>
        )}
      </>
    );
  }
}

export default MessageBody;
