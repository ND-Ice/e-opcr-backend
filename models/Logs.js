const mongoose = require("mongoose");

const Logs = mongoose.model(
  "Logs",
  new mongoose.Schema({
    evaluationId: String,
    actionCreator: {},
    actionMessage: String,
    actionTarget: {},
    date: { type: String, default: Date.now() },
  })
);

module.exports = { Logs };
