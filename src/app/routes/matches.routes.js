module.exports = (app) => {
    const usersController = require("../controllers/users.controllers");
    const matchesController = require("../controllers/matches.controllers");

    var router = require("express").Router();

    router.get("/", matchesController.test);

    router.get(
      "/me",
      usersController.authMiddleware,
      matchesController.matchAlgorithm
    );

    router.get(
      "/preferences",
      usersController.authMiddleware,
      matchesController.viewPreferences
    );

    router.post(
      "/preferences",
      usersController.authMiddleware,
      matchesController.modifyPreferences
    );

    app.use("/api/matches", router);
};