const express = require("express");
const router = express.Router();
const execQuery = require("../utils/executeQuery");
const mysql = require("mysql2");

// create the connection to database
let connection = (connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
}));

// get message
router.get("/msg/:msg_id", async (req, res) => {
  try {
    const { msg_id } = req.params;

    let msgObj = {
      msg: null,
      sender: null,
      receiver: null,
    };

    // get message
    const msgQuery = `SELECT * from messages WHERE id = ?`;
    const msgParams = [msg_id];
    const msgResult = await execQuery.executeQuery({
      query: msgQuery,
      params: msgParams,
    });

    // ---------------------------------------------------------//
    // ------------------- DELETED CODE HERE -------------------//
    // ---------------------------------------------------------//

    // get sender
    const senderQuery = `SELECT id, fname, lname, email, twitter, linkedin, picture, title, phone from users WHERE id = ?`;
    const senderParams = [msgObj.msg.sender];
    const senderResult = await execQuery.executeQuery({
      query: senderQuery,
      params: senderParams,
    });

    // ---------------------------------------------------------//
    // ------------------- DELETED CODE HERE -------------------//
    // ---------------------------------------------------------//

    // get receiver
    const receiverQuery = `SELECT id, fname, lname, email, twitter, linkedin, picture, title, phone from users WHERE id = ?`;
    const receiverParams = [msgObj.msg.receiver];
    const receiverResult = await execQuery.executeQuery({
      query: receiverQuery,
      params: receiverParams,
    });
    msgObj.receiver = receiverResult[0];

    // send
    res.send(msgObj);
  } catch (error) {
    console.log(error);
  }
});

// set message as read
router.put("/read", async (req, res) => {
  try {
    const { id } = req.body;

    // ---------------------------------------------------------//
    // ------------------- DELETED CODE HERE -------------------//
    // ---------------------------------------------------------//

    const query = "UPDATE `messages` SET `is_read` = ? WHERE id = ?";
    const params = [isRead, id];
    const result = await execQuery.executeQuery({ query, params });

    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

// get sent messages
router.get("/sent", async (req, res) => {
  try {
    const { user_id, isDeleted } = req.query;

    // TODO : fix this query in order to get the receiver's info

    const query =
      "SELECT m.id as msg_id, m.sender, m.receiver, m.subject, m.message, m.timestamp, m.is_deleted, m.is_read, m.priority, m.is_read_by, s.id, s.fname, s.lname, s.linkedin, s.twitter, s.email, s.picture, s.password, s.title, r.id, r.fname, r.lname, r.linkedin, r.twitter, r.email, r.picture, r.password, r.title FROM messages m  LEFT JOIN users s ON s.id = m.sender JOIN users r ON r.id = m.receiver WHERE m.is_deleted = ? AND s.id = ? ORDER BY timestamp DESC";
    const params = [isDeleted, user_id];
    let result = await execQuery.executeQuery({ query, params });

    result = result.map((res) => {
      return {
        ...res,
        subject: res.subject.replace(/''/g, "'"),
        message: res.message.replace(/''/g, "'"),
      };
    });

    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

// get received messages
router.get("/received", async (req, res) => {
  try {
    const { user_id, isDeleted } = req.query;

    const query =
      "SELECT m.id as msg_id, m.sender, m.receiver, m.subject, m.message, m.timestamp, m.is_deleted, m.is_read, m.priority, m.is_read_by, r.id, r.fname, r.lname, r.linkedin, r.twitter, r.email, r.picture, r.password, r.title, s.id, s.fname, s.lname, s.linkedin, s.twitter, s.email, s.picture, s.password, s.title FROM messages m LEFT JOIN users s ON s.id = m.sender JOIN users r ON r.id = m.receiver WHERE m.is_deleted = ? AND r.id = ? ORDER BY timestamp DESC";
    const params = [isDeleted, user_id];
    let result = await execQuery.executeQuery({ query, params });

    result = result.map((res) => {
      return {
        ...res,
        subject: res.subject.replace(/''/g, "'"),
        message: res.message.replace(/''/g, "'"),
      };
    });

    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

// delete message
router.put("/msg/:msg_id", async (req, res) => {
  try {
    const { msg_id } = req.params;

    const query =
      "UPDATE `messages` SET `is_deleted` = IF(`is_deleted` = 1, 0, 1) WHERE id = ?";
    const params = [msg_id];
    const result = await execQuery.executeQuery({ query, params });

    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

// send new message
router.post("/new", function (req, res) {
  try {
    let { sender, receiver, message, subject, priority } = req.body;
    const priorityValue = priority === "normal" ? 1 : 2;
    const query = "SELECT id FROM users WHERE email = '" + receiver + "'";

    // TODO : clean all this "connection"
    connection.query(query, (err, receiver_id) => {
      if (err) {
        console.log(err);
        return;
      }

      // escape ' in subject
      subject = subject.replace(/'/g, `''`);

      // escape ' in message
      message = message.replace(/'/g, `''`);
      message = `\n${new Date().toString()}\n\n${message}\n`;

      try {
        const query =
          "INSERT INTO `messages`(`sender`, `receiver`, `subject`, `message`, `priority`) VALUES (?,?,?,?,?)";

        const params = [
          sender,
          receiver_id[0]["id"],
          subject,
          message,
          priorityValue,
        ];

        execQuery.executeQuery({ query, params });

        reply({ sender, receiver, message, subject, priorityValue });
      } catch (error) {
        console.log(err);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// reply
function reply(obj) {
  try {
    let { sender, receiver, message, subject, priorityValue } = obj;

    function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    let replyObj = {
      sender: {},
      receiver: {},
    };

    const query =
      "SELECT id, fname, lname FROM `users` WHERE id = '" + sender + "'";

    // TODO : clean all this "connection"
    connection.query(query, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      replyObj.sender = results[0];

      const query =
        "SELECT id, fname, lname FROM `users` WHERE email = '" + receiver + "'";

      connection.query(query, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }

        replyObj.receiver = results[0];

        const msg = `\n<<<<< >>>>>\n\n${new Date()}\n\n Hello, ${capitalize(
          replyObj.sender.fname
        )}!\n Thank you for you message!\n This is just an automatic reply for you to know that everything works perfectly.\nHave a nice day, \n\n${capitalize(
          replyObj.receiver.fname
        )} \n\n<<<<< >>>>>\n\n ${message}\n`;

        const query =
          "INSERT INTO `messages`(`sender`, `receiver`, `subject`, `message`, `priority`) VALUES ('" +
          replyObj.receiver.id +
          "','" +
          replyObj.sender.id +
          "','Re: " +
          subject +
          "','" +
          msg +
          "','" +
          priorityValue +
          "')";

        setTimeout(() => {
          connection.query(query, (err, results) => {
            if (err) {
              console.log(err);
              return;
            }
          });
        }, 1000 * 2);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = router;
