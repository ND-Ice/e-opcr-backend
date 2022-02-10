const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const deansSchema = new mongoose.Schema({
  email: String,
  name: { firstName: String, lastName: String, middleName: String },
  password: String,
  dept: String,
  college: {
    acronym: { type: String, default: "CAS" },
    full: { type: String, default: "College of Arts and Sciences" },
  },
  isActivated: { type: Boolean, default: false },
  gender: String,
  birthDate: Date,
  image: { current: String, all: [] },
  address: {
    houseNumber: { type: String, default: null },
    street: { type: String, default: null },
    barangay: { type: String, default: null },
    city: { type: String, default: null },
    province: { type: String, default: null },
  },
  contact: String,
  timeStamp: { type: String, default: Date.now() },
  position: String,
  qualification: String,
});

deansSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.SECRET_TOKEN
  );
  return token;
};

const Deans = mongoose.model("Deans", deansSchema);

function validate(dean) {
  // validation schema
  const schema = Joi.object({
    email: Joi.string().email().required(),
    dept: Joi.string().required(),
    password: Joi.string().min(8).required(),
    position: Joi.string().required(),
  }).unknown(true);
  // validation
  return schema.validate(dean);
}

module.exports = { Deans, validate };
