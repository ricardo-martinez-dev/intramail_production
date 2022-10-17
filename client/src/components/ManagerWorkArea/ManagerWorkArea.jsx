import "./style.css";

import axios from "axios";
import React from "react";

class ManagerWorkArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: {},
      isLoading: true,
    };
  }

  handleChange = async (e) => {
    const { userInfo } = this.state;

    userInfo[e.target.name] = e.target.value;

    this.setState({ userInfo });

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/users/update`;

    await axios
      .post(url, userInfo)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  };

  handleDefineManager = async (e) => {
    const { onFetchUserInfo } = this.props.functions;
    const { userInfo } = this.state;
    const { fname, lname } = userInfo;
    const deleteManager = e.target.value === "yes" ? 1 : 0;
    const c = deleteManager
      ? window.confirm(`Are you sure don't want ${fname} ${lname} as a manger?`)
      : window.confirm(
          `Are you sure you want ${fname} ${lname} to be manager?`
        );

    if (!c) return;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/manage/user`;
    const obj = {
      id: userInfo.id,
      isManager: e.target.value === "yes" ? 1 : 0,
    };
    const res = await axios
      .post(url, obj)
      .then((res) => res.data)
      .catch((err) => console.log(err));

    if (!res.error) {
      onFetchUserInfo({ contact: userInfo.id });
    } else {
      alert(res.error);
    }
  };

  handleDeleteUser = async () => {
    const { fname, lname, id } = this.state.userInfo;
    const c = window.confirm(
      `Are you sure you want to delete ${fname} ${lname}?`
    );

    if (!c) return;

    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/users/delete`;
    const obj = { id };

    await axios
      .post(url, obj)
      .then((res) => res.data)
      .catch((err) => console.log(err));

    this.props.functions.onRefreshManagerArea(true);
  };

  async componentDidMount() {
    const { userInfo } = this.props.properties;

    this.setState({ userInfo, isLoading: false });
  }

  render() {
    if (this.state.isLoading) return null;

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
      is_manager,
    } = this.state.userInfo;
    const { properties } = this.props;

    return (
      <div
        id="manager-workarea"
        style={{
          zIndex: properties.currentShown === "manageUser" ? "99999999" : "0",
        }}
      >
        <div id="holder">
          <form onSubmit={(e) => e.preventDefault()}>
            <h2>Manage User</h2>

            <ul>
              <li>
                <span>User Id: </span>
                <span>{id}</span>
              </li>

              <li>
                <span>First Name: </span>
                <span>
                  <input
                    className="capitalize"
                    value={fname}
                    name={"fname"}
                    onChange={(e) => this.handleChange(e)}
                  />
                </span>
              </li>

              <li>
                <span>Last Name: </span>
                <span>
                  <input
                    className="capitalize"
                    value={lname}
                    name={"lname"}
                    onChange={(e) => this.handleChange(e)}
                  />
                </span>
              </li>

              <li>
                <span>Email: </span>
                <input
                  value={email}
                  name={"email"}
                  onChange={(e) => this.handleChange(e)}
                />
              </li>

              <li>
                <span>Phone: </span>
                <input
                  value={phone}
                  name={"phone"}
                  onChange={(e) => this.handleChange(e)}
                />
              </li>

              <li>
                <span>Password: </span>
                <input
                  value={password}
                  name={"password"}
                  onChange={(e) => this.handleChange(e)}
                />
              </li>

              <li>
                <span>Title: </span>
                <span>
                  <input
                    className="capitalize"
                    value={title}
                    name={"title"}
                    onChange={(e) => this.handleChange(e)}
                  />
                </span>
              </li>

              <li>
                <span>Twitter: </span>
                <span>
                  <input
                    value={twitter}
                    name={"twitter"}
                    onChange={(e) => this.handleChange(e)}
                  />
                </span>
              </li>

              <li>
                <span>Linkedin: </span>
                <span>
                  <input
                    value={linkedin}
                    name={"linkedin"}
                    onChange={(e) => this.handleChange(e)}
                  />
                </span>
              </li>

              <li>
                <span>Manager: </span>

                <span className="radio">
                  <span className="btn-radio">
                    <label htmlFor="yes">Yes</label>
                    <input
                      type="radio"
                      id="yes"
                      name="manager"
                      value="yes"
                      checked={is_manager ? true : false}
                      onChange={(e) => this.handleDefineManager(e)}
                    />
                  </span>
                  <span className="btn-radio">
                    <label htmlFor="no">No</label>
                    <input
                      type="radio"
                      id="no"
                      name="manager"
                      value="no"
                      checked={is_manager ? false : true}
                      onChange={(e) => this.handleDefineManager(e)}
                    />
                  </span>
                </span>
              </li>
            </ul>

            <button onClick={() => this.handleDeleteUser()}>Delete User</button>
          </form>
        </div>
      </div>
    );
  }
}

export default ManagerWorkArea;
