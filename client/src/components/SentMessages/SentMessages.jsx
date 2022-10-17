import axios from "axios";
import React from "react";

class SentMessages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      isLoading: true,
      intervalId: null,
    };
  }

  fetchSentMessages = async () => {
    if (!this.state.intervalId) return null;
    const { user_id } = this.props.properties;
    const { isDeleted } = this.props.properties;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/messages/sent`;

    const messages = await axios
      .get(url, {
        params: {
          isDeleted: isDeleted ? 1 : 0,
          user_id,
        },
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    this.setState({ messages, isLoading: false });
  };

  async componentDidMount() {
    this.fetchSentMessages();

    const intervalId = setInterval(async () => this.fetchSentMessages(), 1000);
    this.setState({ intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
    this.setState({ intervalId: null });
  }

  render() {
    const { messages, isLoading } = this.state;

    const {
      onShowUserInfo,
      onReadMessage,
      onUpdateReadMessage,
      onHideNewMessage,
      onCurrentShown,
    } = this.props.functions;

    return (
      <>
        <ul id="msg-headers">
          {isLoading && (
            <h2 style={{ textAlign: "center", padding: "1rem 0" }}>
              Loading...
            </h2>
          )}

          {!isLoading &&
            messages.map((msg) => {
              const dateTime = msg.timestamp
                .replace(/T/g, " ")
                .replace(".", " ")
                .split(" ");

              let date = dateTime[0].split("-");
              date = `${date[2]}/${date[1]}/${date[0]}`;

              const sendingDate = new Date(msg.timestamp).toISOString();
              const todayDate = new Date().toISOString();

              const dateRes =
                sendingDate.split(/T/i)[0].replace("-", "") <
                todayDate.split(/T/i)[0].replace("-", "")
                  ? date
                  : sendingDate.split(/T/i)[1].split(".")[0];

              const highlight =
                this.state.highlight === msg.msg_id && "highlight";

              return (
                <li
                  key={msg.msg_id}
                  className={`msg-headers ${highlight}`}
                  onClick={() => {
                    onShowUserInfo({ contact: msg.receiver });
                    onReadMessage({ msg, action: "sent" });
                    onHideNewMessage();
                    // ---------------------------------------------------------//
                    // ------------------- DELETED CODE HERE -------------------//
                    // ---------------------------------------------------------//

                    onUpdateReadMessage({
                      id: msg.msg_id,
                      isRead: true,
                    });
                    this.setState({ highlight: msg.msg_id });
                  }}
                >
                  <span id="info">
                    <span id="name">
                      To: {msg.fname} {msg.lname}
                    </span>
                    <span id="date-time">{dateRes}</span>
                  </span>
                  <span id="preview">
                    <span>Subject:</span> <span>{msg.subject}</span>
                  </span>
                </li>
              );
            })}
        </ul>
      </>
    );
  }
}

export default SentMessages;
