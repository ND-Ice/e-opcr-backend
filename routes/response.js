const express = require("express");
const _ = require("lodash");
const router = express.Router();
const multer = require("multer");

const { Response } = require("../models/Response");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// submit reponse
router.post("/", upload.array("files"), async (req, res) => {
  const attachments = [];
  const {
    evaluationId,
    userId,
    templateId,
    coreFunctions,
    supportFunctions,
    coreFunctionsMeasure,
    supportFunctionsMeasure,
    average,
    user,
    userSignature,
  } = req.body;
  let response = await Response.findOne({
    userId: req.body.userId,
    evaluationId,
  });
  if (response) return res.status(400).send("This user already responded.");

  response = new Response({
    evaluationId,
    userId,
    user: JSON.parse(user),
    templateId,
    coreFunctions: JSON.parse(coreFunctions),
    supportFunctions: JSON.parse(supportFunctions),
    coreFunctionsMeasure,
    supportFunctionsMeasure,
    status: {
      faculty: {
        signature: userSignature,
        user: JSON.parse(user),
      },
    },
    ratings: { average: average },
  });

  req.files.forEach((file) => attachments.push(file));
  response.attachments = attachments;

  await response.save();
  res.send(response);
});

// rate the evaluation
router.put("/:id", async (req, res) => {
  const response = await Response.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!response) return res.status(404).send("Not found");
  return res.send(response);
});

// get response of specific evaluation
router.get("/evaluation/:evaluationId", async (req, res) => {
  const responses = await Response.find({
    evaluationId: req.params.evaluationId,
  });
  return res.send(responses);
});

// get all response
router.get("/", async (req, res) => {
  const responses = await Response.find({});
  return res.send(responses);
});

// delete response
router.delete("/:id", async (req, res) => {
  const response = await Response.findByIdAndDelete(req.params.id);
  if (!response) res.status(400).send("Invalid Id");
  return res.send("Deteled successfully");
});

module.exports = router;
