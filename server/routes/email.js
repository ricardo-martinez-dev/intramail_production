const express = require("express");
const router = express.Router();
const execQuery = require("../utils/executeQuery");

// get single contacts by email
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const query =
      "SELECT id, fname, lname, email, picture, title, phone, linkedin, twitter FROM users WHERE email = ?";
    const params = [email];
    const result = await execQuery.executeQuery({ query, params });

    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
