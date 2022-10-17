const execQuery = require("../utils/executeQuery");

class NewUser {
  constructor(obj) {
    const { fname, lname, password, email, title, is_manager } = obj.req.body;
    this.fname = fname;
    this.lname = lname;
    this.password = password;
    this.email = email;
    this.title = title;
    this.isManager = is_manager ? 1 : 0;
    this.res = obj.res;
    this.userId = null;
  }

  #createUser = async () => {
    try {
      const queryOne =
        "INSERT INTO `users`(`fname`, `lname`, `password`, `email`, `title`, `is_manager`) VALUES (?,?,?,?,?,?)";
      const paramsOne = [
        this.fname,
        this.lname,
        this.password,
        this.email,
        this.title,
        this.isManager,
      ];

      return await execQuery.executeQuery({
        query: queryOne,
        params: paramsOne,
      });
    } catch (error) {
      console.log(error);
    }
  };

  #getUserId = async () => {
    try {
      const queryTwo = "SELECT `id` FROM `users` WHERE email = ?";
      const paramsTwo = [this.email];
      const result = await execQuery.executeQuery({
        query: queryTwo,
        params: paramsTwo,
      });

      this.userId = result[0]["id"];
      return;
    } catch (error) {
      console.log(error);
    }
  };

  #createSettings = async () => {
    try {
      const queryThree = "INSERT INTO `settings` (`user_id`) VALUES ('?')";
      const paramsThree = [this.userId];
      const res = await execQuery.executeQuery({
        query: queryThree,
        params: paramsThree,
      });
    } catch (error) {
      console.log(error);
    }
  };

  #createPicture = async () => {
    try {
      const query =
        "INSERT INTO `pictures` (`picture`, `user_id`) VALUES (?,?)";
      const params = ["logo.jpg", this.userId];

      await execQuery.executeQuery({ query, params });
    } catch (error) {
      console.log(error);
    }
  };

  #addNewUser = async () => {
    try {
      // create new user
      await this.#createUser();
      // get new user's id
      await this.#getUserId();
      // create new user's settings
      this.#createSettings();
      // create picture
      this.#createPicture();

      this.res.send({ success: true });
    } catch (error) {
      console.log(error);
    }
  };

  // check whether email already exists
  createNewUser = async () => {
    try {
      const query = "SELECT email FROM `users` WHERE email = ?";
      const params = [this.email];

      const result = await execQuery.executeQuery({ query, params });

      // user exists
      if (result.length > 0) this.res.send({ emailExists: true });
      // user does not exists
      else this.#addNewUser();
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = NewUser;
