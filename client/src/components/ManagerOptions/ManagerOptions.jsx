import "./style.css";

import axios from "axios";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

class ManagerOptions extends React.Component {
  constructor(props) {
    super(props);

    this.intervalId = null;
    this.state = {
      contacts: [],
      searchBox: "",
      isLoading: true,
      highlight: null,
    };
  }

  handleHighlight = (highlight) => {
    this.setState({ highlight });
  };

  // fetch all contacts
  fetchAllContacts = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/contacts`;
    const res = await axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const contacts = res.filter((c) => c.id !== this.props.properties.user_id);

    this.setState({ contacts, isLoading: false });
  };

  handleChange = (e) => {
    const { value } = e.target;
    const isInvalidInput = value.match(/\W+/g);

    if (isInvalidInput) return;

    this.setState({ searchBox: value });
  };

  handleSeach = async (e) => {
    let { value } = e.target;
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/contacts/all/filtered/${value}`;
    const res = await axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.log(err));

    if (value) {
      const contacts = res.filter(
        (c) => c.id !== this.props.properties.user_id
      );
      this.setState({ contacts });
    } else this.fetchAllContacts();
  };

  async componentDidMount() {
    await this.fetchAllContacts();

    const intervalId = setInterval(async () => {
      const { refreshManagerArea } = this.props.properties;

      if (refreshManagerArea) {
        // ---------------------------------------------------------//
        // ------------------- DELETED CODE HERE -------------------//
        // ---------------------------------------------------------//
      }
    }, 1000);

    this.intervalId = intervalId;
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    // if (this.state.isLoading) return null;
    const { contacts, isLoading } = this.state;
    const { onFetchUserInfo, onCreateNewUser, onCurrentShown } =
      this.props.functions;
    const { properties } = this.props;

    return (
      <div
        id="manager-options"
        style={{
          zIndex: properties.currentShown === "manager" ? "99999999" : "0",
        }}
      >
        <div id="contacts-container">
          <h2>Manage Users</h2>

          <div id="btn-new-user">
            <button
              onClick={() => {
                onCreateNewUser();
                onCurrentShown("newUser");
              }}
            >
              New User
            </button>
          </div>

          <div id="contact-headers">
            <div id="search-box">
              <span id="seach-label">
                <FontAwesomeIcon icon={faSearch} />
              </span>

              <input
                type="text"
                value={this.state.searchBox}
                onChange={async (e) => {
                  await this.handleChange(e);
                  this.handleSeach(e);
                }}
              />
            </div>

            {isLoading && <h2 style={{ textAlign: "center" }}>Loading...</h2>}

            {!isLoading && (
              <ul id="contact-headers-ul">
                {contacts.map((contact) => {
                  const { id } = contact;

                  return (
                    <li
                      key={id}
                      className={`${this.state.highlight == id && "highlight"}`}
                      onClick={async () => {
                        this.handleHighlight(id);
                        onFetchUserInfo({ contact: id });
                      }}
                    >
                      <Contact
                        contact={contact}
                        functions={this.props.functions}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
}

class Contact extends React.Component {
  render() {
    const { id, fname, lname, email } = this.props.contact;
    const { onHideNewMessage, onCurrentShown } = this.props.functions;

    return (
      <div
        id="left"
        onClick={() => {
          onHideNewMessage();
          onCurrentShown("manageUser");
        }}
      >
        <span id="contact-name">
          {fname} {lname}
        </span>
        <span>{email}</span>
      </div>
    );
  }
}

export default ManagerOptions;
