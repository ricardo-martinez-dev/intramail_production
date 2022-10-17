import React from "react";
import ManagerIcon from "../ManagerTools/ManagerTools";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faArrowRightFromBracket,
  faTrashAlt,
  faAddressBook,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

class Nav extends React.Component {
  render() {
    const icons = [
      {
        section: "messages",
        icon: faEnvelope,
        currentShown: "messages",
      },
      {
        section: "trash",
        icon: faTrashAlt,
        currentShown: "deleted",
      },
      {
        section: "contacts",
        icon: faAddressBook,
        currentShown: "contacts",
      },
      {
        section: "settings",
        icon: faCog,
        currentShown: "settings",
      },
    ];

    const {
      onHideNewMessage,
      onToggleSection,
      onLogOut,
      functions,
      properties,
    } = this.props;

    const { onCurrentShown } = this.props.functions;

    return (
      <>
        {true && (
          <nav id="nav">
            <ul>
              {icons.map(({ section, icon, currentShown }) => (
                <li
                  key={section}
                  style={{
                    boxShadow:
                      properties.section === section &&
                      "inset 0.2rem 0.2rem 0.2rem #000, inset -0.2rem -0.2rem 0.2rem #f1f1f1",
                  }}
                  onClick={() => {
                    // ---------------------------------------------------------//
                    // ------------------- DELETED CODE HERE -------------------//
                    // ---------------------------------------------------------//
                  }}
                >
                  <FontAwesomeIcon icon={icon} />
                </li>
              ))}

              <ManagerIcon properties={properties} functions={functions} />

              <li onClick={() => onLogOut()}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
              </li>
            </ul>
          </nav>
        )}
      </>
    );
  }
}

export default Nav;
