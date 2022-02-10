const mongoose = require("mongoose");

const Admins = mongoose.model(
  "Admins",
  new mongoose.Schema({
    email: String,
    name: { firstName: String, lastName: String },
    password: String,
  })
);

module.exports = { Admins };
