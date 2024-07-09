module.exports = app => {
    const usersController = require("../controllers/users.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", usersController.test);
    router.get(
      "/me",
      usersController.authMiddleware,
      usersController.CheckUser
    );

    app.use("/api/users", router);
  };