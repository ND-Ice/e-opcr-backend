const express = require("express");
const _ = require("lodash");
const router = express.Router();

const { Evaluations, validateEvaluation } = require("../models/Evaluations");

// create evaluation
router.post("/", async (req, res) => {
  const { error } = validateEvaluation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let evaluation = await Evaluations.findOne({
    targetYear: req.body.targetYear,
  });
  if (evaluation)
    return res
      .status(400)
      .send("Evaluation with the same year is already posted.");

  evaluation = new Evaluations(_.pick(req.body, ["targetYear", "due"]));
  await evaluation.save();
  res.send(evaluation);
});

// get all evaluations
router.get("/", async (req, res) => {
  const evaluations = await Evaluations.find({});
  if (!evaluations) return res.status(400).send("No Evaluation yet");
  return res.send(evaluations);
});

// get a single evaluation document
router.get("/:id", async (req, res) => {
  const evaluation = await Evaluations.findById(req.params.id);
  if (!evaluation) return res.status(404).send("Evaluation not found");
  return res.send(evaluation);
});

// get pas evaluations for specific department
router.get("/filter/past/:dept", async (req, res) => {
  const past = await Evaluations.find({
    isFinished: true,
    dept: req.params.dept,
  });
  return res.send(past);
});

// get evaluations by department
router.get("/department/:dept", async (req, res) => {
  const evaluations = await Evaluations.find({ dept: req.params.dept });
  return res.send(evaluations);
});

// delete evaluation
router.delete("/:id", async (req, res) => {
  const evaluation = await Evaluations.findByIdAndDelete(req.params.id);
  if (!evaluation) return res.status(404).send("Evalution not found");
  res.send(evaluation);
});

module.exports = router;
