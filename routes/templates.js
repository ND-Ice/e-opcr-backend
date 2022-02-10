const express = require("express");
const MonkeyLearn = require("monkeylearn");
const Sentiment = require("sentiment");
const router = express.Router();

const sentiment = new Sentiment();

const { Templates } = require("../models/Templates");

router.post("/", async (req, res) => {
  const {
    coreFunctionsMeasure,
    supportFunctionsMeasure,
    coreFunctions,
    supportFunctions,
    target,
    targetYear,
  } = req.body;

  let template = await Templates.findOne({ targetYear, target });
  if (template) return res.status(400).send("This template is already existed");

  template = new Templates({
    coreFunctionsMeasure,
    supportFunctionsMeasure,
    coreFunctions,
    supportFunctions,
    target,
    targetYear,
  });

  await template.save();
  return res.send(template);
});

// get templates
router.get("/", async (req, res) => {
  const templates = await Templates.find();
  return res.send(templates);
});

// delete templates
router.delete("/:id", async (req, res) => {
  const template = await Templates.findByIdAndDelete(req.params.id);
  if (!template)
    return res
      .status(400)
      .send("The template with the given id does not exist");

  return res.send("Deleted Successfully.");
});

// classify sentiment
router.post("/analyzer", async (req, res) => {
  const { accomplishment } = req.body;
  const ml = new MonkeyLearn(process.env.API_KEY);
  let model_id = "cl_mYNzFnaT";
  let data = [accomplishment];

  try {
    ml.classifiers.classify(model_id, data).then((response) => {
      return res.send(response.body);
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.post("/upload-classifier", async (req, res) => {
  const { tagName, accomplishment } = req.body;
  const ml = new MonkeyLearn(process.env.API_KEY);
  let model_id = "cl_mYNzFnaT";

  let data = [
    {
      text: accomplishment,
      tags: [tagName],
    },
  ];

  try {
    ml.classifiers.upload_data(model_id, data).then((response) => {
      res.send(response.body);
    });
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.post("/analyze", async (req, res) => {
  const { comment } = req.body;
  const sentimentResult = sentiment.analyze(comment, { language: "en" });
  return res.send(sentimentResult);
});

module.exports = router;
