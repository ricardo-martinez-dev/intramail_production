import { faUserGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React from "react";

class ManagerIcon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isManager: false,
    };
  }

  async componentDidMount() {
    const { user_id } = this.props.properties;
    const url = `${process.env.REACT_APP_BASE_URL}/api/v1/settings/manager/${user_id}`;
    const res = await axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.log(err));

    if (res[0].is_manager === 1) this.setState({ isManager: true });
  }

  render() {
    const { properties } = this.props;
    const { onToggleSection, onCurrentShown } = this.props.functions;
    const { isManager } = this.state;

    return (
      <>
        {isManager && (
          <li
            style={{
              boxShadow:
                properties.section === "manager" &&
                "inset 0.2rem 0.2rem 0.2rem #000, inset -0.2rem -0.2rem 0.2rem #f1f1f1",
            }}
            onClick={() => {
              onToggleSection("manager");
              onCurrentShown("manager");
            }}
          >
            <FontAwesomeIcon icon={faUserGear} />
          </li>
        )}
      </>
    );
  }
}

export default ManagerIcon;
