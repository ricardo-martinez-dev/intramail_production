const express = require("express");
const router = express.Router();
const execQuery = require("../utils/executeQuery");
const NewUser = require("../classes/NewUser");
const mysql = require("mysql2");

// create the connection to database
let connection = (connection = mysql.createConnection({
  host: process.env.DEV_HOST,
  user: process.env.DEV_USER,
  password: process.env.DEV_PASSWORD,
  database: process.env.DEV_DB,
}));

// get users
router.get("/", async (req, res) => {
  try {
    try {
      const query = "SELECT * FROM `users`";
      const users = await execQuery.executeQuery({ query });

      res.send(users);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

// update user
router.post("/update", async (req, res) => {
  try {
    const {
      id,
      fname,
      lname,
      password,
      email,
      title,
      phone,
      linkedin,
      twitter,
    } = req.body;

    const query =
      "UPDATE `users` SET `fname`= ?,`lname`= ?,`password`= ?,`email`= ?, `title`= ?,`phone`= ?,`linkedin`= ?,`twitter`= ? WHERE id= ?";
    const params = [
      fname,
      lname,
      password,
      email,
      title,
      phone,
      linkedin,
      twitter,
      id,
    ];

    const user = await execQuery.executeQuery({ query, params });

    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

router.post("/new", async (req, res) => {
  try {
    for (const prop in req.body) if (req.body[prop].length === 0) return;

    const newUser = new NewUser({ req: req, res: res });
    newUser.createNewUser();
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const params = [id];

    const queryDeleteUsers = "DELETE FROM `users` WHERE id = ?";
    await execQuery.executeQuery({ query: queryDeleteUsers, params });

    const queryDeleteSettings = "DELETE FROM `settings` WHERE user_id = ?";
    await execQuery.executeQuery({ query: queryDeleteSettings, params });

    res.send({ success: true });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
