import "./style.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

class UserInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPictureOpen: false,
      isLoading: true,
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: false });
  }

  render() {
    const { properties, functions } = this.props;

    const { onShowNewMessage } = this.props.functions;

    const {
      fname,
      lname,
      picture,
      email,
      title,
      phone,
      linkedin,
      twitter,
      is_available,
    } = properties.userInfo;

    const social = { linkedin, twitter };

    var socials = Object.keys(social).map((key) => {
      if (!social[key]) return;

      return (
        <span key={key}>
          <a href={social[key]} target="_blank">
            <img
              src={require(`../../assets/images/icons/${key}.png`)}
              alt={key}
            />
          </a>
        </span>
      );
    });

    return (
      <div id="user-info">
        <div id="info">
          {picture && (
            <div
              id="picture"
              className={this.state.isPictureOpen ? "open" : "close"}
              onClick={() =>
                this.setState({
                  isPictureOpen: this.state.isPictureOpen ? false : true,
                })
              }
            >
              <img
                src={
                  picture === "logo.jpg"
                    ? `${process.env.REACT_APP_BASE_URL}/picture/logo.jpg`
                    : picture
                }
                alt=""
              />
            </div>
          )}

          {fname && (
            <div id="info">
              <ul>
                <li>
                  <span>Name :</span>
                  <span className="capitalize">
                    {fname} {lname}
                  </span>
                </li>
                <li>
                  <span>Email :</span>
                  <span
                    id="email"
                    onClick={() => {
                      // ---------------------------------------------------------//
                      // ------------------- DELETED CODE HERE -------------------//
                      // ---------------------------------------------------------//
                    }}
                  >
                    {email}
                  </span>
                </li>
                <li>
                  <span>Title :</span>
                  <span className="capitalize">{title}</span>
                </li>
                <li>
                  <span>Phone :</span>
                  <span>{phone}</span>
                </li>
                <li>
                  <span>Availability :</span>
                  <span
                    style={{
                      color: is_available ? "green" : "red",
                    }}
                  >
                    <FontAwesomeIcon icon={faCircle} />
                  </span>
                </li>

                <li id="social">{socials.map((social) => social)}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default UserInfo;
