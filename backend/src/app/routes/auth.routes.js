module.exports = app => {
    const authController = require("../controllers/auth.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", authController.test);

    app.use("/api/auth", router);
  };