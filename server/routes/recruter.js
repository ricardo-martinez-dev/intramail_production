require("dotenv").config();
const express = require("express");
const router = express.Router();
const utils = require("../utils/executeQuery");

router.post("/", async (req, res) => {
  try {
    const isTester = true;
    // define email and password
    const email = isTester ? process.env.EMAIL : "";
    // query password

    // ---------------------------------------------------------//
    // ------------------- DELETED CODE HERE -------------------//
    // ---------------------------------------------------------//

    const userPassword = await utils
      .executeQuery({ query, params })
      .then((res) => res);

    const password = userPassword[0].password;

    const result = {
      email,
      password,
      firstName: "",
      lastName: "",
      confirmedPassword: "",
    };

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
