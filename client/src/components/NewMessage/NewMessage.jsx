import "./style.css";
import React from "react";
import axios from "axios";
import NewMessageBody from "../NewMessageBody/NewMessageBody";
import NewMessageButtons from "../NewMessageButtons/NewMessageButtons";
import NewMessageHeader from "../NewMessageHeader/NewMessageHeader";

class NewMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      receiver: "",
      subject: "",
      priority: "normal",
      message: "",
      contacts: [],
      isLoaded: false,
    };
  }

  handleEmailAutoFill = async () => {
    let { id, message, subject, timestamp, email } =
      this.props.properties.userInfo;

    if (!id) return;
    if (!email) email = this.props.properties.readMessage.sender.email;

    this.props.functions.onShowUserInfo({ contact: id });

    this.setState({
      receiver: email,
      message: message ? message : "",
      subject: subject ? subject : "",
    });
  };

  handleForward = () => {
    const { id, message, subject, timestamp, forward } =
      this.props.properties.userInfo;

    if (forward) {
      this.setState({
        message,
        subject,
      });
    }
  };

  fetchContacts = async () => {
    const { receiver } = this.state;

    if (receiver.length === 0) {
      this.setState({ contacts: [] });
      return;
    }

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/contacts/all/filtered/${receiver}`;

    let contacts = await axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.log(err));

    this.setState({ contacts });
  };

  fetchContactByEmail = async () => {
    const { receiver } = this.state;

    if (!receiver) return;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/email/${receiver}`;

    let res = await axios
      .get(url)
      .then((res) => res.data[0])
      .catch((err) => console.log(err));

    if (!this.state.isLoaded) {
      if (!res) return;
      this.props.functions.onShowUserInfo({ contact: res.id });
      this.setState({ isLoaded: true });
    }
  };

  handleChange = async (e) => {
    const isInvalidInput = e.target.value.match(/\W+/g);
    if (isInvalidInput && e.target.name === "receiver") return;

    this.setState({ [e.target.name]: e.target.value, isLoaded: false });
  };

  handleSend = async () => {
    const { user_id } = this.props.properties;
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/messages/new`;

    const res = await axios
      .post(url, {
        receiver: this.state.receiver,
        subject: this.state.subject,
        message: this.state.message,
        priority: this.state.priority,
        sender: user_id,
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    this.props.functions.onFoo();

    this.setState({
      receiver: "",
      subject: "",
      message: "",
      priority: "",
    });
  };

  handleDelete = () => {
    const c = window.confirm("Are you sure you want to delete this message?");

    if (c) {
      this.setState({
        receiver: "",
        subject: "",
        message: "",
        priority: "",
      });
    }
  };

  handleSetReceiver = (obj) => {
    const { receiver, contacts } = obj;
    this.setState({ receiver, contacts });
  };

  async componentDidMount() {
    await this.handleEmailAutoFill();
    await this.handleForward();
    this.setState({ isLoaded: true });
  }

  render() {
    const { message, receiver, subject, contacts, priority } = this.state;
    const { functions, properties } = this.props;

    this.fetchContactByEmail();

    return (
      <div
        id="new-messages"
        style={
          {
            // ---------------------------------------------------------//
            // ------------------- DELETED CODE HERE -------------------//
            // ---------------------------------------------------------//
          }
        }
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <NewMessageHeader
            foo={{ receiver, subject, contacts, priority }}
            functions={functions}
            properties={properties}
            onFetchContacts={this.fetchContacts}
            onChange={this.handleChange}
            onSetReceiver={this.handleSetReceiver}
          />

          <div id="body">
            <NewMessageButtons
              foo={{ message, receiver, subject }}
              functions={functions}
              properties={properties}
              onDelete={this.handleDelete}
              onSend={this.handleSend}
            />

            <NewMessageBody
              properties={properties}
              message={this.state.message}
              onChange={this.handleChange}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default NewMessage;
