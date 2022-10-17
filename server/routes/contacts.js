const express = require("express");
const router = express.Router();
const execQuery = require("../utils/executeQuery");

// get contact by id
router.get("/:contact_id", async (req, res) => {
  try {
    const { contact_id } = req.params;

    // ---------------------------------------------------------//
    // ------------------- DELETED CODE HERE -------------------//
    // ---------------------------------------------------------//
    const result = await execQuery.executeQuery({ query, params });

    res.send(result[0]);
  } catch (error) {
    console.log(error);
  }
});

// get all contacts
router.get("/", async (req, res) => {
  try {
    const query =
      "SELECT id, fname, lname, email, title, phone, linkedin, twitter FROM users ORDER BY fname ASC";
    const contacts = await execQuery.executeQuery({ query });

    res.send(contacts);
  } catch (error) {
    console.log(error);
  }
});

// filter all contacts
router.get("/all/filtered/:filter", async (req, res) => {
  try {
    let { filter } = req.params;
    if (!filter) return;
    if (filter.length <= 0) return;

    // ---------------------------------------------------------//
    // ------------------- DELETED CODE HERE -------------------//
    // ---------------------------------------------------------//
    const params = [filterWord, filterWord, filterWord];
    const filteredContacts = await execQuery.executeQuery({ query, params });

    res.send(filteredContacts);
  } catch (error) {
    console.log(error);
  }
});

// filter favorite contacts
router.get("/favorite/filtered/:filter/:user_id", async (req, res) => {
  try {
    const { filter, user_id } = req.params;
    if (!filter || !user_id) return;

    // ---------------------------------------------------------//
    // ------------------- DELETED CODE HERE -------------------//
    // ---------------------------------------------------------//

    res.send(filteredUser);
  } catch (error) {
    console.log(error);
  }
});

// get favorite contacts
router.get("/favorite/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    // ---------------------------------------------------------//
    // ------------------- DELETED CODE HERE -------------------//
    // ---------------------------------------------------------//

    res.send(favotire);
  } catch (error) {
    console.log(error);
  }
});

// add contact to favorites
router.post("/fav/new", async (req, res) => {
  try {
    const { user_id } = req.body;

    // ---------------------------------------------------------//
    // ------------------- DELETED CODE HERE -------------------//
    // ---------------------------------------------------------//

    const query =
      "INSERT INTO `favorite_contacts`(`user_id`, `contact_id`) VALUES (?, ?)";
    const params = [user_id, contactId];
    const newFavContact = await execQuery.executeQuery({ query, params });

    res.send(newFavContact);
  } catch (error) {
    console.log(error);
  }
});

// remove contact to favorites
router.post("/fav/old", async (req, res) => {
  try {
    const { user_id } = req.body;

    // ---------------------------------------------------------//
    // ------------------- DELETED CODE HERE -------------------//
    // ---------------------------------------------------------//

    const query =
      "DELETE FROM `favorite_contacts` WHERE user_id = ? AND contact_id = ?";
    const params = [user_id, contactId];
    const favoriteContacts = await execQuery.executeQuery({ query, params });

    res.send(favoriteContacts);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
