const express = require("express");
const router = express.Router();
const execQuery = require("../utils/executeQuery");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const query = // ----- DELETED CODE HERE ----- /
    const params = // ----- DELETED CODE HERE ----- /
      
    const result = await execQuery
      .executeQuery({ query, params })
      .then((res) => res);

    if (result.length > 0) res.send(result[0]);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
