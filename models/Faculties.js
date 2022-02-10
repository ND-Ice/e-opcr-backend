const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const facultySchema = new mongoose.Schema({
  email: String,
  name: { firstName: String, lastName: String, middleName: String },
  password: String,
  dept: String,
  isActivated: { type: Boolean, default: false },
  college: {
    acronym: { type: String, default: "CAS" },
    full: { type: String, default: "College of Arts and Sciences" },
  },
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

facultySchema.methods.generateAuthToken = function () {
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

const Faculties = mongoose.model("Faculties", facultySchema);

function validate(faculty) {
  // validation schema
  const schema = Joi.object({
    email: Joi.string().email().required(),
    dept: Joi.string().required(),
    position: Joi.string().required(),
    password: Joi.string().required(),
  }).unknown(true);
  // validation
  return schema.validate(faculty);
}

module.exports = { Faculties, validate };
