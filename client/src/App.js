import "./App.css";
import React from "react";
import Contacts from "./components/Contacts/Contacts";
import Messages from "./components/Messages/Messages";
import axios from "axios";
import UserInfo from "./components/UserInfo/UserInfo";
import MessageReader from "./components/MessageReader/MessageReader";
import NewMessage from "./components/NewMessage/NewMessage";
import DeletedMessages from "./components/DeletedMessages/DeletedMessages";
import Settings from "./components/Settings/Settings";
import News from "./components/News/News";
import LogInPage from "./components/LogInPage/LogInPage";
import ManagerOptions from "./components/ManagerOptions/ManagerOptions";
import ManagerWorkArea from "./components/ManagerWorkArea/ManagerWorkArea";
import NewUser from "./components/NewUser/NewUser";
import Nav from "./components/Nav/Nav";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: null,
      email: null,
      password: null,
      userData: null,
      section: "login",
      readMessage: { msg: null, sender: null, receiver: null, action: null },
      sendNewMessage: false,
      managerSettings: false,
      newUser: false,
      currentShown: "messages",
      settings: {
        "font-color": "",
        "bg-color": "",
        "font-family": "",
      },
      userInfo: {},
      isLoading: true,
      refreshManagerArea: false,
    };
  }

  handleRefreshManagerArea = (ev) => {
    this.setState({ refreshManagerArea: ev });
  };

  handleCurrentShown = (currentShown) => {
    this.setState({ currentShown });
  };

  handleGetUserData = async () => {
    const { email, password } = this.state;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/login`;
    const obj = { email, password };
    const userData = await axios
      .post(url, obj)
      .then((res) => res.data)
      .catch((err) => console.log(err));

    this.setState({
      userData,
      password: userData.password,
      email: userData.email,
    });
  };

  handleUpdateUserData = async (e) => {
    const { userData } = this.state;

    userData[e.target.name] = e.target.value;
    this.setState({ userData });

    if (e.target.name === "email") this.setState({ email: e.target.value });
    if (e.target.name === "password") {
      this.setState({ password: e.target.value });
    }

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/users/update`;

    await axios
      .post(url, userData)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  };

  // login
  handleLogIn = async (elem) => {
    const { email, password } = elem;
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/login`;
    const obj = { email, password };
    const res = await axios
      .post(url, obj)
      .then((res) => res.data)
      .catch((err) => console.log(err));

    if (res) {
      this.setState({ user_id: res.id, email, password, section: "messages" });

      await this.handleFetchSettings();
      await this.handleUpdateTheme(this.state.settings);
    } else alert("Wrong email or password!");
  };

  // log out
  handleLogOut = () => {
    const c = window.confirm("Are you sure you want to log out?");

    if (c) {
      this.setState({
        section: "login",
        email: "",
        password: "",
        settings: {
          "font-color": "",
          "bg-color": "",
          "font-family": "",
        },
      });
    }
  };

  // toggle sections
  handleToggleSection = (section) => {
    this.handleHideUserInfo();
    this.setState({ section });
    this.setState({ managerSettings: false, newUser: false });
  };

  // hide user info
  handleHideUserInfo = () => {
    let userInfo = this.state.userInfo;
    for (const i in userInfo) userInfo[i] = null;
    this.setState({ userInfo });
  };

  // fetch picture
  handleFetchPicture = async (user_id) => {
    const picUrl = `${process.env.REACT_APP_BASE_URL}/api/v1/picture/${user_id}`;

    const res = await axios
      .get(picUrl)
      .then((res) => res.data.url)
      .catch((err) => console.log(err));

    return res;
  };

  // show user info
  handleShowUserInfo = async (obj) => {
    const { contact } = obj;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/contacts/${contact}`;
    const userInfo = await axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    userInfo.picture = await this.handleFetchPicture(contact);
    this.setState({ userInfo });
  };

  handleCreateNewUser = () => {
    this.setState({ managerSettings: false, newUser: true });
  };

  handleFetchUserInfo = async (obj) => {
    const { contact } = obj;
    this.setState({ managerSettings: false });

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/manage/user/${contact}`;
    const userInfo = await axios
      .get(url)
      .then((res) => res.data[0])
      .catch((err) => console.log(err));
    userInfo.picture = await this.handleFetchPicture(contact);

    this.setState({ userInfo });
    this.setState({ managerSettings: true, newUser: false });
  };

  // read message
  handleReadMessage = async (obj) => {
    const { msg_id } = obj.msg;
    const { action } = obj;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/messages/msg/${msg_id}`;
    const readMessage = await axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    readMessage.action = action;

    this.setState({ readMessage });
  };

  // show new message
  handleShowNewMessage = (userInfo) => {
    this.setState({ sendNewMessage: true, userInfo: userInfo ? userInfo : {} });
  };

  // hide new message
  handleHideNewMessage = () => {
    this.setState({ sendNewMessage: false });
  };

  // set message as read
  handleUpdateReadMessage = async (obj) => {
    const { id, isRead } = obj;
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/messages/read`;

    await axios
      .put(url, {
        id,
        isRead,
      })
      .then((res) => res)
      .catch((err) => console.log(err));
  };

  // answer message
  handleAnswerMessage = (obj) => {
    const userInfo = {
      id: obj.sender,
      message: obj.message,
      subject: obj.subject,
      timestamp: obj.timestamp,
    };

    this.setState({ userInfo, sendNewMessage: true });
  };

  // foward message
  handleForwardMessage = (obj) => {
    const userInfo = {
      message: obj.message,
      subject: obj.subject,
      timestamp: obj.timestamp,
      forward: true,
    };

    this.setState({ userInfo, sendNewMessage: true });
  };

  // settings
  handleHexToRGB = (h) => {
    let r = 0,
      g = 0,
      b = 0;

    // 3 digits
    if (h.length == 4) {
      r = "0x" + h[1] + h[1];
      g = "0x" + h[2] + h[2];
      b = "0x" + h[3] + h[3];

      // 6 digits
    } else if (h.length == 7) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
    }

    return "" + +r + "," + +g + "," + +b + "";
  };

  handleRgbToHex = (rgb) => {
    let sep = rgb.indexOf(",") > -1 ? "," : " ";

    rgb = rgb.substr(4).split(")")[0].split(sep);

    let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);

    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;

    return "#" + r + g + b;
  };

  handleFetchSettings = async () => {
    const userId = this.state.user_id;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/settings/users/${userId}`;

    const res = await axios
      .get(url)
      .then((res) => res.data[0])
      .catch((err) => console.log(err));

    const settings = {
      "bg-color": res.bg_color,
      "font-color": res.font_color,
      "font-family": res.font_family,
    };

    this.setState({
      settings,
    });
  };

  handleUpdateTheme = (object) => {
    for (const [key, value] of Object.entries(object)) {
      if (key === "font-family") {
        document.documentElement.style.setProperty(`--${key}`, value);
      } else {
        document.documentElement.style.setProperty(
          `--${key}`,
          this.handleHexToRGB(value)
        );
      }
    }

    const settings = {
      "bg-color": object["bg-color"],
      "font-color": object["font-color"],
      "font-family": object["font-family"],
    };

    this.setState({
      settings,
    });
  };

  handleUploadPic = () => {
    this.setState({ section: "settings" });
  };

  handleFoo = () => {
    this.setState({ sendNewMessage: false, currentShown: "messages" });
  };

  render() {
    const { section, sendNewMessage, managerSettings, newUser } = this.state;

    const functions = {
      onLogIn: this.handleLogIn,
      onShowUserInfo: this.handleShowUserInfo,
      onHideUserInfo: this.handleHideUserInfo,
      onReadMessage: this.handleReadMessage,
      onShowNewMessage: this.handleShowNewMessage,
      onHideNewMessage: this.handleHideNewMessage,
      onUpdateReadMessage: this.handleUpdateReadMessage,
      onAnswerMessage: this.handleAnswerMessage,
      onForwardMessage: this.handleForwardMessage,
      onRgbToHex: this.handleRgbToHex,
      onHexToRGB: this.handleHexToRGB,
      onUpateTheme: this.handleUpdateTheme,
      onUploadPic: this.handleUploadPic,
      onToggleSection: this.handleToggleSection,
      onFetchUserInfo: this.handleFetchUserInfo,
      onCreateNewUser: this.handleCreateNewUser,
      onGetUserData: this.handleGetUserData,
      onUpdateUserData: this.handleUpdateUserData,
      onCurrentShown: this.handleCurrentShown,
      onRefreshManagerArea: this.handleRefreshManagerArea,
    };

    return (
      <>
        {section === "login" && (
          <LogInPage properties={this.state} functions={functions} />
        )}

        {section !== "login" && (
          <div className="App">
            <Nav
              properties={this.state}
              functions={functions}
              onToggleSection={this.handleToggleSection}
              onHideNewMessage={this.handleHideNewMessage}
              onLogOut={this.handleLogOut}
            />

            {section === "messages" && (
              <Messages properties={this.state} functions={functions} />
            )}

            {section === "trash" && (
              <DeletedMessages properties={this.state} functions={functions} />
            )}

            {section === "settings" && (
              <Settings properties={this.state} functions={functions} />
            )}

            {section === "manager" && (
              <ManagerOptions properties={this.state} functions={functions} />
            )}

            {!sendNewMessage && !managerSettings && !newUser && (
              <MessageReader
                properties={this.state}
                message={this.state.readMessage}
                functions={functions}
              />
            )}

            {sendNewMessage && !managerSettings && !newUser && (
              <NewMessage properties={this.state} functions={functions} />
            )}

            {managerSettings && !newUser && (
              <ManagerWorkArea properties={this.state} functions={functions} />
            )}

            {this.state.userInfo.id ? (
              <UserInfo properties={this.state} functions={functions} />
            ) : (
              <News properties={this.state} functions={functions} />
            )}
          </div>
        )}
      </>
    );
  }
}

export default App;
