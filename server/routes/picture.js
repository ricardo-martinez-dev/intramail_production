const express = require("express");
const router = express.Router();
const utils = require("../utils/executeQuery");
require("dotenv").config();

router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const query = "SELECT `picture` FROM `pictures` WHERE `user_id` = ?";
    const params = [user_id];
    const url = await utils.executeQuery({ query, params });

    if (!url[0].picture) {
      const url = "url_here";

      res.send({ url: `${url}/picture/logo.jpg` });
    } else {
      res.send({ url: url[0]["picture"] });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
