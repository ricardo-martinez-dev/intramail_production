import "./style.css";
import React from "react";
import axios from "axios";

class LogInPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",

      userCredentials: {},
      isLoading: true,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async componentDidMount() {
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/recruter`;
    const obj = { url: window.location.href };
    const userCredentials = await axios
      .post(url, obj)
      .then((res) => res.data)
      .catch((err) => console.log(err));

    // ---------------------------------------------------------//
    // ------------------- DELETED CODE HERE -------------------//
    // ---------------------------------------------------------//

    this.setState({ isLoading: false });
  }

  render() {
    if (this.state.isLoading) return null;

    const { onLogIn } = this.props.functions;

    return (
      <div id="login">
        <h1>Log in</h1>

        <form onSubmit={(e) => e.preventDefault()}>
          <p>Email</p>
          <input
            name="email"
            value={this.state.email}
            onChange={(e) => this.handleChange(e)}
          />

          <p>Password</p>
          <input
            name="password"
            value={this.state.password}
            onChange={(e) => this.handleChange(e)}
          />

          <button onClick={() => onLogIn()}>ENTER</button>
        </form>
      </div>
    );
  }
}

export default LogInPage;
