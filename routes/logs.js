const express = require("express");
const _ = require("lodash");
const router = express.Router();

const { Logs } = require("../models/Logs");

router.post("/", async (req, res) => {
  const { evaluationId, actionCreator, actionMessage, actionTarget } = req.body;

  try {
    const logs = new Logs({
      evaluationId,
      actionCreator,
      actionMessage,
      actionTarget,
    });
    await logs.save();
    return res.send(logs);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get("/:evaluationId", async (req, res) => {
  const logs = await Logs.find({ evaluationId: req.params.evaluationId }).sort({
    date: -1,
  });
  return res.send(logs);
});

module.exports = router;
