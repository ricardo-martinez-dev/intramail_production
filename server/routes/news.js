const express = require("express");
const router = express.Router();
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

// fetch news
router.get("/", async (req, res) => {
  try {
    if (process.env.ENVIRONMENT != "dev") {
      // development
      fs.readFile("./json/news.json", (err, data) => {
        res.send(JSON.parse(data));
      });
    } else {
      // production
      const url = `url_here.com`;
      const news = await axios
        .get(url)
        .then((res) => res.data.data)
        .catch((err) => console.log(err));
      const result = news.map((n) => {
        return {
          url: n.url,
          img: n.image,
          header: n.title,
        };
      });

      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
