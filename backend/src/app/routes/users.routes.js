module.exports = app => {
    const usersController = require("../controllers/users.controllers");
  
    var router = require("express").Router();
  
    router.get("/", usersController.test);
    router.get(
      "/me",
      usersController.authMiddleware,
      usersController.CheckUser
    );

    app.use("/api/users", router);
  };