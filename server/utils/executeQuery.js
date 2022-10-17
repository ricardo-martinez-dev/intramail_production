const mysql = require("mysql2");
require("dotenv").config();

// create the connection to database
let connection = (connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
}));

const executeQuery = async ({ query, params }) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, result) => {
      if (err) reject({ status: "fail", err });

      resolve(result);
    });
  });
};

module.exports = {
  connection,
  executeQuery,
};
