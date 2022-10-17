const express = require("express");
const router = express.Router();
const execQuery = require("../utils/executeQuery");

router.get("/user/:contact_id", async (req, res) => {
  try {
    const { contact_id } = req.params;
    const query =
      "SELECT * FROM settings JOIN users ON users.id = settings.user_id WHERE users.id = ?";
    const params = [contact_id];
    const result = await execQuery.executeQuery({ query, params });

    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

router.post("/user", async (req, res) => {
  try {
    const { id, isManager } = req.body;

    if (parseInt(isManager) === 1) {
      // new manager
      const query = "UPDATE `users` SET `is_manager`='1' WHERE id= ?";
      const params = [id];
      const results = execQuery.executeQuery({ query, params });

      res.send(results);
    } else {
      // delete manager
      const query = "SELECT is_manager FROM users WHERE is_manager = 1";
      const numberOfManagers = await execQuery.executeQuery({ query, res });

      if (numberOfManagers.length > 1) {
        // deleting allowed
        const query = "UPDATE `users` SET `is_manager`='0' WHERE id= ?";
        const params = [id];
        const results = await execQuery.executeQuery({ query, params });

        res.send(results);
      } else {
        // deleting not allowed
        res.send({
          error: "Operation not allowed. You are the only manager",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
