import "./style/style.css";
import axios from "axios";
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faSearch,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

class Contacts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      favoriteContacts: [],
      sections: ["all", "favorite"],
      currentSection: "all",
      searchBox: "",
      isLoading: true,
      highlight: null,
    };
  }

  handleHighlight = (highlight) => {
    this.setState({ highlight });
  };

  toggleSection = (section) => {
    this.setState({ currentSection: section });
  };

  // fetch all contacts
  fetchAllContacts = async () => {
    const res = await logic.fetchAllContacts();
    this.setState(res);
  };

  // fetch favorite contacts
  fetchFavoriteContacts = async () => {
    const res = await logic.fetchFavoriteContacts({ props: this.props });
    this.setState(res);
  };

  handleChange = (e) => {
    const res = logic.handleChange(e);
    this.setState(res);
  };

  handleSeach = async (e) => {
    let { value } = e.target;
    const { currentSection } = this.state;
    const props = this.props;

    const contacts = await logic.handleSeach({ value, props, currentSection });

    if (value) this.setState({ contacts });
    else {
      if (currentSection === "all") this.fetchAllContacts();
      else this.fetchFavoriteContacts();
    }
  };

  fetchContacts = async () => {
    await this.fetchFavoriteContacts();
    this.fetchAllContacts();
  };

  async componentDidMount() {
    await this.fetchContacts();
    this.setState({ isLoading: false });
  }

  render() {
    // if (this.state.isLoading) return null;
    const { contacts, currentSection, sections, favoriteContacts, isLoading } =
      this.state;
    const {
      onShowUserInfo,
      onHideUserInfo,
      onShowNewMessage,
      onHideNewMessage,
    } = this.props.functions;

    const { properties } = this.props;

    return (
      <div
        id="contacts"
        style={{
          zIndex: properties.currentShown === "contacts" ? "99999999" : "0",
        }}
      >
        <div id="contacts-container">
          <h2>Contacts</h2>

          <div id="contact-type">
            <ul>
              {sections.map((section, i) => {
                const classes =
                  section === currentSection
                    ? "msg-contact-type highlight"
                    : "msg-contact-type";

                return (
                  <li
                    key={i}
                    className={classes}
                    onClick={() => {
                      this.toggleSection(section);
                      onHideUserInfo();

                      if (section === "favorite") this.fetchFavoriteContacts();
                      if (section === "all") this.fetchAllContacts();
                    }}
                  >
                    {section}
                  </li>
                );
              })}
            </ul>
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
                      className={`${this.state.highlight == id && "highlight"}`}
                      key={id}
                      onClick={() => {
                        this.handleHighlight(id);
                        onShowUserInfo({ contact: id });
                      }}
                    >
                      <Contact
                        contact={contact}
                        functions={this.props.functions}
                      />

                      <div id="center">
                        <span
                          onClick={async () => {
                            await onHideNewMessage();
                            onShowUserInfo({ contact: id });
                            onShowNewMessage(contact);
                          }}
                        >
                          <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                      </div>

                      <Heart
                        currentSection={currentSection}
                        contact={contact}
                        favoriteContacts={favoriteContacts}
                        properties={this.props.properties}
                        onFetchFavoriteContacts={this.fetchFavoriteContacts}
                        onFetchAllContacts={this.fetchAllContacts}
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
    const { onHideNewMessage } = this.props.functions;

    return (
      <div
        id="left"
        onClick={() => {
          onHideNewMessage();
        }}
      >
        <span id="contact-name">
          {fname} {lname}
        </span>
        <span id="contact-email">{email}</span>
      </div>
    );
  }
}

class Heart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: "",
    };
  }

  addToFavorites = async () => {
    const { contact } = this.props;
    const { user_id } = this.props.properties;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/contacts/fav/new`;

    await axios
      .post(url, {
        user_id,
        contact,
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));
  };

  removeFromFavorites = async () => {
    const { contact } = this.props;
    const { user_id } = this.props.properties;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/contacts/fav/old`;

    await axios
      .post(url, {
        user_id,
        contact,
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));
  };

  async componentDidMount() {
    const { currentSection, favoriteContacts, contact } = this.props;
    const favoriteContactIds = favoriteContacts.map((c) => c.id);
    const isFavorite = favoriteContactIds.includes(contact.id) ? true : false;
    const showFullHeart = currentSection === "all" && !isFavorite;
    const icon = showFullHeart ? `heart` : `heart-broken`;

    this.setState({ icon });
  }

  render() {
    const { currentSection, onFetchFavoriteContacts, onFetchAllContacts } =
      this.props;

    return (
      <div id="right">
        <span id="heart">
          <FontAwesomeIcon
            icon={this.state.icon === "heart" ? faPlus : faMinus}
            style={{ color: this.state.icon == "heart" ? "blue" : "red" }}
            onClick={async () => {
              if (currentSection === "all") {
                const icon =
                  this.state.icon === `heart-broken` ? `heart` : `heart-broken`;

                if (icon === `heart-broken`) {
                  this.addToFavorites();
                  onFetchAllContacts();
                } else this.removeFromFavorites();

                this.setState({ icon });
              }

              if (currentSection === "favorite") {
                await this.removeFromFavorites();
                onFetchFavoriteContacts();
              }
            }}
          />
        </span>
      </div>
    );
  }
}

export default Contacts;
