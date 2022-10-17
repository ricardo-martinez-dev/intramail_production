import { faTrash, faTrashRestore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React from "react";

class IconTrash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDeleted: true,
      msgId: null,
      intervalId: null,
    };
  }

  fetchMessage = async () => {
    if (!this.state.intervalId) return null;
    const { id } = this.props.msg;
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/messages/msg/${id}`;

    const res = await axios
      .get(url)
      .then((res) => res.data.msg)
      .catch((err) => console.log(err));

    const isDeleted = res.is_deleted;
    const msgId = res.id;

    this.setState({ isDeleted, msgId });
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
    const { onDeleteMessage } = this.props.functions;
    const { msgId, isDeleted } = this.state;

    return (
      <li
        onClick={() => {
          onDeleteMessage({ id: msgId });
        }}
      >
        <span>
          {isDeleted ? (
            <FontAwesomeIcon icon={faTrashRestore} />
          ) : (
            <FontAwesomeIcon icon={faTrash} />
          )}
        </span>
        <span id="info">{isDeleted ? "restore" : "delete"}</span>
      </li>
    );
  }
}

export default IconTrash;
