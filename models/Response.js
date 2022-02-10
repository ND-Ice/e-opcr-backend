const mongoose = require("mongoose");

const Response = mongoose.model(
  "Response",
  new mongoose.Schema({
    evaluationId: String,
    userId: String,
    templateId: String,
    coreFunctionsMeasure: String,
    supportFunctionsMeasure: String,
    coreFunctions: [],
    supportFunctions: [],
    attachments: [],
    ratings: {
      average: { type: String, default: null },
    },
    feedback: {
      comments: { title: { type: String, default: "" }, list: [] },
      recommendations: { title: { type: String, default: "" }, list: [] },
    },
    dateSubmitted: { type: String, default: Date.now() },
    status: {
      faculty: {
        signature: String,
        user: {},
      },
      intermediateSupervisor: {
        signature: String,
        dateApproved: String,
        user: {},
        isApproved: { type: Boolean, default: false },
      },
      director: {
        signature: String,
        dateApproved: String,
        user: {},
        isApproved: { type: Boolean, default: false },
      },
      PMT: {
        signature: String,
        dateApproved: String,
        user: {},
        isApproved: { type: Boolean, default: false },
      },
      HEAD: {
        signature: String,
        dateApproved: String,
        user: {},
        isApproved: { type: Boolean, default: false },
      },
      HR: {
        signature: String,
        dateApproved: String,
        user: {},
        isApproved: { type: Boolean, default: false },
      },
    },
  })
);

module.exports = { Response };
