const express = require("express");
const router = express.Router();
const execQuery = require("../utils/executeQuery");

// fetch settings
router.get("/users/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const query = "SELECT * FROM settings where user_id = ?";
    const params = [user_id];
    const settings = await execQuery.executeQuery({ query, params });

    res.send(settings);
  } catch (error) {
    console.log(error);
  }
});

// fetch user management status
router.get("/manager/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const query = "SELECT is_manager FROM users where id = ?";
    const params = [user_id];
    const manager = await execQuery.executeQuery({ query, params });

    res.send(manager);
  } catch (error) {
    console.log(error);
  }
});

// fetch availability
router.get("/availability/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const query = "SELECT is_available FROM settings where user_id = ?";
    const params = [user_id];
    const availability = await execQuery.executeQuery({ query, params });

    res.send(availability);
  } catch (error) {
    console.log(error);
  }
});

// update availability
router.put("/availability", async (req, res) => {
  try {
    let { user_id, isAvailable } = req.body;

    // ---------------------------------------------------------//
    // ------------------- DELETED CODE HERE -------------------//
    // ---------------------------------------------------------//

    const query = "UPDATE `settings` SET `is_available`= ? WHERE user_id = ?";
    const params = [isAvailable, user_id];
    const availability = await execQuery.executeQuery({ query, params });

    res.send(availability);
  } catch (error) {
    console.log(error);
  }
});

// update settings
router.put("/users", async (req, res) => {
  try {
    // ---------------------------------------------------------//
    // ------------------- DELETED CODE HERE -------------------//
    // ---------------------------------------------------------//

    const settings = await execQuery.executeQuery({ query, params });

    res.send(settings);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
