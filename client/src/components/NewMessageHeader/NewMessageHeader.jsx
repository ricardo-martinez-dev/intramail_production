import React from "react";

class NewMessageHeader extends React.Component {
  render() {
    const { receiver, subject, contacts, priority } = this.props.foo;
    const { onChange, onFetchContacts, onSetReceiver } = this.props;

    return (
      <div id="header">
        <ul>
          <li>
            <span>To: </span>
            <span id="to-receiver">
              <input
                type="text"
                name="receiver"
                value={receiver}
                autoComplete="off"
                autoFocus
                onChange={async (e) => {
                  await onChange(e);
                  // ---------------------------------------------------------//
                  // ------------------- DELETED CODE HERE -------------------//
                  // ---------------------------------------------------------//
                }}
              />
              {contacts.length > 0 && (
                <span id="contacts-list">
                  <ul>
                    {contacts.map((c) => (
                      <li
                        key={c.id}
                        onClick={() =>
                          onSetReceiver({ receiver: c.email, contacts: "" })
                        }
                      >
                        <span className="dropdown-info">
                          <span className="font-weight-bold">Name:</span>
                          <span className="font-weight-bold">
                            {c.fname} {c.lname}
                          </span>
                        </span>
                        <span className="dropdown-info">
                          <span className="font-weight-normal">Title:</span>
                          <span className="font-weight-normal">{c.title}</span>
                        </span>
                        <span className="dropdown-info">
                          <span className="font-weight-normal">Email:</span>
                          <span
                            className="font-weight-normal"
                            id="dropdown-info-email"
                          >
                            {c.email}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </span>
              )}
            </span>
          </li>

          <li>
            <span>Subject: </span>
            <span>
              <input
                type="text"
                name="subject"
                autoComplete="off"
                value={subject}
                onChange={(e) => onChange(e)}
              />
            </span>
          </li>

          <li id="priority">
            <span>Priority:</span>
            <span id="selector">
              <select
                name="priority"
                value={priority}
                onChange={(e) => onChange(e)}
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </span>
          </li>
        </ul>
      </div>
    );
  }
}

export default NewMessageHeader;
