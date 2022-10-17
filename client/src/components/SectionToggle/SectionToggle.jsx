import React from "react";

class SectionToggle extends React.Component {
  render() {
    const { sections, currentSection } = this.props.properties;
    const { onToggleSection, onHideUserInfo } = this.props.functions;

    return (
      <div id="direction">
        <ul>
          {sections.map((section, i) => {
            // ---------------------------------------------------------//
            // ------------------- DELETED CODE HERE -------------------//
            // ---------------------------------------------------------//

            return (
              <li
                key={i}
                className={classes}
                onClick={() => {
                  onToggleSection(section);
                  onHideUserInfo();
                }}
              >
                {section}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default SectionToggle;
