require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

// todo : set cors options before deploying
var corsOptions = {};

app.use(cors(corsOptions));
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/picture", express.static("pictures"));

// initiate routes
const routes = [
  "recruter",
  "picture",
  "login",
  "users",
  "messages",
  "contacts",
  "manage",
  "email",
  "news",
  "settings",
  "profile",
];

routes.forEach((route) => {
  const reqUrl = `/api/v1/${route}`;
  const routeUrl = require(`./routes/${route}`);
  app.use(reqUrl, routeUrl);
});

// production
app.listen(PORT, () => {
  console.log(`Listening... ${PORT}`);
});
