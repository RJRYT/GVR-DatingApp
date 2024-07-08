const User = require("../models").user;

exports.test = (req, res) => {
  res.json({"message": "hi"});
};