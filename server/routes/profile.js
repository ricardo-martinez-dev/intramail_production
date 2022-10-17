const express = require("express");
const router = express.Router();
const utils = require("../utils/executeQuery");

router.post("/", async (req, res) => {
  try {
    const { user_id, picture } = req.body;

    const query = "SELECT * FROM `pictures` WHERE user_id = ?";
    const params = [user_id];
    const pictures = await utils.executeQuery({ query, params });
    const isUserFound = pictures.length > 0 ? true : false;
    let newQuery;
    let newParams;

    if (isUserFound) {
      newQuery = "UPDATE `pictures` SET `picture` = ? WHERE user_id = ?";
      newParams = [picture, user_id];
    } else {
      newQuery = "INSERT INTO `pictures`(`picture`, `user_id`) VALUES (?,?)";
      newParams = [picture, user_id];
    }

    await utils.executeQuery({
      query: newQuery,
      params: newParams,
    });

    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
