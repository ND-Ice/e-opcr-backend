const mongoose = require("mongoose");
const Joi = require("joi");

const Evaluations = mongoose.model(
  "Evaluations",
  new mongoose.Schema({
    college: {
      acronym: { type: String, default: "CAS" },
      full: { type: String, default: "College of Arts and Sciences" },
    },
    due: { type: String },
    targetYear: { type: String },
    timeStamp: { type: String, default: Date.now() },
  })
);

function validateEvaluation(evaluation) {
  const schema = Joi.object({
    targetYear: Joi.string().required(),
    due: Joi.string().required(),
  }).unknown(true);
  return schema.validate(evaluation);
}

module.exports = { Evaluations, validateEvaluation };
