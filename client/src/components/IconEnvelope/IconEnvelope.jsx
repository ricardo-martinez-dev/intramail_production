import axios from "axios";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";

class IconEnvelope extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRead: true,
      msgId: null,
      intervalId: null,
    };
  }

  fetchMessage = async () => {
    if (!this.state.intervalId) return null;
    // todo
    const { id } = this.props.properties.readMessage.msg;
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/messages/msg/${id}`;

    const res = await axios
      .get(url)
      .then((res) => res.data.msg)
      .catch((err) => console.log(err));

    const isRead = res.is_read;
    const msgId = res.id;

    this.setState({ isRead, msgId });
  };

  // ! TODO : stop this interval somehow
  async componentDidMount() {
    const intervalId = setInterval(() => {
      this.fetchMessage();
    }, 1000);
    this.setState({ intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
    this.setState({ intervalId: null });
  }

  render() {
    const { onUpdateReadMessage } = this.props.functions;
    const { user_id } = this.props.properties;
    const { msg, receiver } = this.props.properties.readMessage;
    const { msgId, isRead } = this.state;

    return (
      <>
        {msg && receiver.id === user_id && (
          <li
            onClick={() => {
              onUpdateReadMessage({ id: msgId, isRead: isRead ? 0 : 1 });
            }}
          >
            <span>
              {isRead ? (
                <FontAwesomeIcon icon={faEnvelopeOpen} />
              ) : (
                <FontAwesomeIcon icon={faEnvelope} />
              )}
            </span>
            <span id="info">{isRead ? "close" : "open"}</span>
          </li>
        )}
      </>
    );
  }
}

export default IconEnvelope;
