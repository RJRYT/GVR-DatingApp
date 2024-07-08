module.exports = app => {
    const health = require('express-ping');
  
    var router = require("express").Router();
  
    router.use(health.ping());

    app.use("/api/ping", router);
  };