import "./style.css";

import axios from "axios";
import React from "react";

class NewUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fname: "",
      lname: "",
      title: "",
      email: "",
      password: "",
      is_manager: false,
      isCreated: false,
    };
  }

  handleChange = (ev) => {
    const { fname, lname } = this.state;

    this.setState({
      [ev.target.name]: ev.target.value,
      email: `${fname}.${lname}@email.com`,
    });
  };

  handleDefineManager = async (e) => {
    this.setState({
      is_manager: e.target.value === "yes" ? true : false,
    });
  };

  generatePassword = () => {
    const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "a", "s", "d", "f", "h", "j"];

    let password = [];

    for (let i = 0; i < 15; i++) {
      let rand = Math.floor(Math.random() * chars.length);

      if (typeof chars[rand] === "string") {
        let isEven = Math.floor(Math.random() * chars.length) % 2 === 0;

        if (isEven) password.push(chars[rand].toUpperCase());
        else password.push(chars[rand]);
      } else {
        password.push(chars[rand]);
      }
    }

    this.setState({ password: password.join("") });
  };

  handleCreateUser = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/users/new`;
    const obj = this.state;
    const res = await axios
      .post(url, obj)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (res.emailExists)
      alert(
        "A user the the same email already exists. Please, change the email!"
      );

    if (res.success) this.setState({ isCreated: true });
  };

  async componentDidMount() {
    //
  }

  render() {
    const { fname, lname, title, password, is_manager, email, isCreated } =
      this.state;
    const { properties, functions } = this.props;
    const { onRefreshManagerArea } = this.props.functions;

    return (
      <div
        id="new-user"
        style={{
          zIndex: properties.currentShown === "newUser" ? "99999999" : "0",
        }}
      >
        <div id="holder">
          {isCreated && (
            <div id="result">
              <h2>User created successfully!</h2>

              <ul id="output">
                <li>
                  <span id="label">Fist name</span>
                  <span className="capitalized">{fname}</span>
                </li>
                <li>
                  <span id="label">Last name</span>
                  <span className="capitalized">{lname}</span>
                </li>
                <li>
                  <span id="label">Email</span>
                  <span>{email}</span>
                </li>
                <li>
                  <span id="label">Title</span>
                  <span className="capitalized">{title}</span>
                </li>
                <li>
                  <span id="label">Password</span>
                  <span>{password}</span>
                </li>
              </ul>
            </div>
          )}

          {!isCreated && (
            <form onSubmit={(e) => e.preventDefault()}>
              <h2>New User</h2>
              <ul>
                <li>
                  <span id="label">First Name: </span>
                  <span id="fooo">
                    <input
                      required
                      className="capitalize"
                      name="fname"
                      value={`${fname}`}
                      onChange={(ev) => {
                        this.handleChange(ev);
                        this.generatePassword();
                      }}
                    />
                  </span>
                </li>

                <li>
                  <span id="label">Last Name: </span>
                  <span id="fooo">
                    <input
                      required
                      className="capitalize"
                      name="lname"
                      value={`${lname}`}
                      onChange={(e) => {
                        this.handleChange(e);
                        this.generatePassword();
                      }}
                    />
                  </span>
                </li>

                <li>
                  <span id="label">Email: </span>
                  <span id="fooo">
                    <input
                      required
                      value={email}
                      onChange={(e) => {
                        this.setState({ email: e.target.value });
                      }}
                    />
                  </span>
                </li>

                <li>
                  <span id="label">Password: </span>
                  <span id="fooo">
                    <input
                      required
                      name="password"
                      value={`${password}`}
                      onChange={(e) => this.handleChange(e)}
                    />
                  </span>
                </li>

                <li>
                  <span id="label">Title: </span>
                  <span id="fooo">
                    <input
                      required
                      className="capitalize"
                      name="title"
                      value={`${title}`}
                      onChange={(e) => {
                        this.handleChange(e);
                        this.generatePassword();
                      }}
                    />
                  </span>
                </li>

                <li>
                  <span id="label">Manager: </span>

                  <div className="radio">
                    <span className="btn-radio">
                      <label for="yes">Yes</label>
                      <input
                        type="radio"
                        id="yes"
                        name="manager"
                        value="yes"
                        checked={is_manager ? true : false}
                        onClick={(e) => {
                          this.handleDefineManager(e);
                          this.generatePassword();
                        }}
                      />
                    </span>
                    <span className="btn-radio">
                      <label for="no">No</label>
                      <input
                        type="radio"
                        id="no"
                        name="manager"
                        value="no"
                        checked={is_manager ? false : true}
                        onClick={(e) => {
                          this.handleDefineManager(e);
                          this.generatePassword();
                        }}
                      />
                    </span>
                  </div>
                </li>
              </ul>

              <button
                onClick={async () => {
                  await this.handleCreateUser();
                  onRefreshManagerArea(true);
                }}
              >
                Create User
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }
}

export default NewUser;
