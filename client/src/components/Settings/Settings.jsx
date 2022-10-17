import "./style.css";

import axios from "axios";
import React from "react";
import Resizer from "react-image-file-resizer";

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "font-color": "#151515",
      "bg-color": "#154555",
      "font-family": "",
      isAvailable: false,
      isLoading: true,
      avatar: "",
      foo: false,

      userInfo: {},
      newImage: "",
    };
  }

  // handle input change
  handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "isAvailable") {
      this.updateAvailability();
      this.setState({ isAvailable: value });
      return;
    }

    const foo = ["name", "password", "phone", "twitter", "linkedin", "title"];
    if (foo.includes(name.toLowerCase())) {
      const userInfo = { ...this.state.userInfo, [name]: value };
      this.setState({ userInfo });
    }

    const bar = ["bg-color", "font-color"];

    if (bar.includes(name.toLowerCase())) {
      document.documentElement.style.setProperty(`--${name}`, value);
      this.setState({ [name]: value });
    }

    if (name.toLowerCase() == "font-family") {
      this.setState({ [name]: value });
    }

    this.updateSettings();
  };

  // fetch user picture
  fetchPicture = async () => {
    const { user_id } = this.state.userInfo;

    const pic = await axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/v1/picture/${user_id}`)
      .then((res) => res.data.url)
      .catch((err) => err);

    // ---------------------------------------------------------//
    // ------------------- DELETED CODE HERE -------------------//
    // ---------------------------------------------------------//

    const userInfo = { ...this.state.userInfo, picture };
    this.setState({ userInfo });
  };

  // update picture
  handleUpdatePicture = async (event) => {
    var fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        const newImage = await Resizer.imageFileResizer(
          event.target.files[0],
          300,
          300,
          "JPEG",
          100,
          0,
          async (uri) => {
            const { user_id } = this.state.userInfo;

            const url = `${process.env.REACT_APP_BASE_URL}/api/v1/profile/`;
            const obj = {
              user_id,
              picture: uri,
            };

            const res = await axios
              .post(url, obj)
              .then((res) => res)
              .catch((err) => err);

            const userInfo = { ...this.state.userInfo, picture: uri };

            this.setState({ userInfo });
          },
          "base64",
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  // convert colors
  convertColor = (obj) => {
    const hex = obj;
    const red = parseInt(hex[1] + hex[2], 16);
    const green = parseInt(hex[3] + hex[4], 16);
    const blue = parseInt(hex[5] + hex[6], 16);

    return `${red}, ${green}, ${blue}`;
  };

  // update user settings
  updateSettings = async () => {
    const userId = this.props.properties.user_id;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/settings/users`;

    await axios
      .put(url, {
        userId,
        bgColor: this.state["bg-color"],
        fontColor: this.state["font-color"],
        fontFamily:
          this.state["font-family"] === "roboto" ? "roboto" : "montserrat",
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    this.props.functions.onUpateTheme({
      ["bg-color"]: this.state["bg-color"],
      ["font-color"]: this.state["font-color"],
      ["font-family"]: this.state["font-family"],
    });
  };

  // fetch user settings
  fetchSettings = async () => {
    const { settings } = this.props.properties;

    this.setState({
      ["bg-color"]: settings["bg-color"],
      ["font-color"]: settings["font-color"],
      ["font-family"]: settings["font-family"],
    });
  };

  // get user availability
  fetchAvailability = async () => {
    const { user_id } = this.props.properties;
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/settings/availability/${user_id}`;

    const res = await axios
      .get(url)
      .then((res) => res.data[0])
      .catch((err) => console.log(err));

    this.setState({
      isAvailable: res.is_available.toString() === "1" ? true : false,
    });
  };

  // update user availability
  updateAvailability = async () => {
    const { user_id } = this.props.properties;
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/settings/availability`;

    const res = await axios
      .put(url, {
        user_id,
        isAvailable: this.state.isAvailable ? false : true,
      })
      .then((res) => res)
      .catch((err) => console.log(err));

    this.fetchAvailability();
  };

  // capitalize words
  capitalize = (obj) => {
    return obj[0].toUpperCase() + obj.substring(1);
  };

  async componentDidMount() {
    this.fetchSettings();
    this.fetchAvailability();

    await this.props.functions.onGetUserData();

    this.setState({ userInfo: this.props.properties.userData });

    await this.fetchPicture();

    this.setState({ isLoading: false });
  }

  render() {
    const {
      fname,
      lname,
      title,
      id,
      phone,
      email,
      password,
      linkedin,
      twitter,
    } = this.state.userInfo;

    const { isLoading } = this.state;

    const { onUpdateUserData } = this.props.functions;
    const { currentShown } = this.props.properties;

    return (
      <div
        id="settings"
        style={{
          zIndex: currentShown === "settings" ? "99999999" : "0",
        }}
      >
        <div id="settings-container">
          <h2>Settings</h2>

          {isLoading && <h2 style={{ textAlign: "center" }}>Loading...</h2>}

          {!isLoading && (
            <div id="upload-pic">
              <form
                encType="multipart/form-data"
                method="post"
                onSubmit={(ev) => ev.preventDefault()}
              >
                <img src={this.state.userInfo.picture} alt="user" />

                <label id="foo" htmlFor="avatar">
                  Change Picture
                </label>
                <input
                  type="file"
                  id="avatar"
                  onChange={(event) => {
                    // ---------------------------------------------------------//
                    // ------------------- DELETED CODE HERE -------------------//
                    // ---------------------------------------------------------//
                  }}
                />
              </form>
            </div>
          )}

          {/* update font color */}

          {!isLoading && (
            <div id="colors">
              <div className="colors">
                <label htmlFor="font-color">Font</label>
                <input
                  value={this.state["font-color"]}
                  type="color"
                  id="font-color"
                  name="font-color"
                  onChange={(e) => this.handleChange(e)}
                ></input>
              </div>

              {/* update bg color */}
              <div className="colors">
                <label htmlFor="bg-color">Background</label>
                <input
                  value={this.state["bg-color"]}
                  type="color"
                  id="bg-color"
                  name="bg-color"
                  onChange={(e) => this.handleChange(e)}
                ></input>
              </div>
            </div>
          )}

          {/* update font */}
          {!isLoading && (
            <div id="fonts">
              <div className="fonts">
                <label htmlFor="font-family">Font Family</label>
                <select
                  name="font-family"
                  value={this.state["font-family"]}
                  onChange={(e) => this.handleChange(e)}
                >
                  <option value="roboto">Roboto</option>
                  <option value="montserrat">Montserrat</option>
                </select>
              </div>
            </div>
          )}

          {/* update availavility */}
          {!isLoading && (
            <div id="availability">
              <div className="availability">
                <label htmlFor="isAvailable">Availability</label>
                <select
                  name="isAvailable"
                  value={this.state.isAvailable}
                  onChange={(e) => this.handleChange(e)}
                >
                  <option value={true}>Available</option>
                  <option value={false}>Unavailable</option>
                </select>
              </div>
            </div>
          )}

          {/* update user info */}
          {!isLoading && (
            <div id="user-info-form">
              <h3 id="user-info-form-header">Your Data</h3>
              <form onSubmit={(e) => e.preventDefault()}>
                <ul>
                  <li id="fname">
                    <span>First Name: </span>
                    <span>{this.capitalize(fname)}</span>
                  </li>

                  <li id="fname">
                    <span>Last Name: </span>
                    <span>{this.capitalize(lname)}</span>
                  </li>

                  <li>
                    <span>E-mail: </span>
                    <span>{email}</span>
                  </li>

                  <List
                    value={password}
                    name={this.capitalize("password")}
                    func={onUpdateUserData}
                    foo={this.handleChange}
                  />

                  <List
                    value={phone}
                    name={this.capitalize("phone")}
                    func={onUpdateUserData}
                    foo={this.handleChange}
                  />

                  <List
                    value={title}
                    name={this.capitalize("title")}
                    func={onUpdateUserData}
                    foo={this.handleChange}
                  />

                  <List
                    value={twitter}
                    name={this.capitalize("twitter")}
                    func={onUpdateUserData}
                    foo={this.handleChange}
                  />

                  <List
                    value={linkedin}
                    name={this.capitalize("linkedin")}
                    func={onUpdateUserData}
                    foo={this.handleChange}
                  />
                </ul>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }
}

class List extends React.Component {
  state = {};
  render() {
    const { name, value, func, foo } = this.props;

    return (
      <li>
        <span>{name}: </span>
        <span>
          <input
            value={value}
            name={name.toLowerCase()}
            onChange={(e) => {
              func(e);
              foo(e);
            }}
          />
        </span>
      </li>
    );
  }
}

export default Settings;
