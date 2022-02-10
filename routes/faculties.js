const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { Faculties, validate } = require("../models/Faculties");
const sendMail = require("../sendMail");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// upload profile picture
router.patch(
  "/upload-profile/:id",
  upload.single("image"),
  async (req, res) => {
    const faculty = await Faculties.findById(req.params.id);
    if (!faculty) return res.status(400).send("user does not exist");

    faculty.image.current = `https://e-opcr-backend.herokuapp.com/${req.file.path}`;
    await faculty.save();
    return res.send(faculty);
  }
);

// create faculty account
router.post("/", async (req, res) => {
  const {
    email,
    dept,
    firstName,
    lastName,
    middleName,
    birthDate,
    password,
    position,
  } = req.body;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let faculty = await Faculties.findOne({
    email,
    firstName,
    lastName,
    middleName,
  });
  if (faculty) return res.status(400).send("This user already exist.");

  faculty = new Faculties({
    email,
    name: {
      firstName,
      lastName,
      middleName,
    },
    birthDate,
    dept,
    password,
    position,
  });
  const salt = await bcrypt.genSalt(10);
  faculty.password = await bcrypt.hash(faculty.password, salt);

  await faculty.save();

  return res.send(
    "The admin will check the validity of your account. Please wait for 1-2 working days for the admin's decision through your email."
  );
});

// update faculty primary account account
router.patch("/:id", async (req, res) => {
  const { contact, houseNumber, street, barangay, city, province } = req.body;
  const faculty = await Faculties.findById(req.params.id);
  if (!faculty) return res.status(404).send("user does not exist");

  faculty.contact = contact;
  faculty.address.houseNumber = houseNumber;
  faculty.address.street = street;
  faculty.address.barangay = barangay;
  faculty.address.city = city;
  faculty.address.province = province;
  await faculty.save();
  return res.send(faculty);
});

// update faculty basic information
router.put("/:id", async (req, res) => {
  const faculty = await Faculties.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!faculty) return res.status(404).send("User does not exist.");
  return res.send(faculty);
});

// get the current faculties
router.get("/:id", async (req, res) => {
  const faculty = await Faculties.findById(req.params.id);
  if (!faculty) return res.status(400).send("This user does not exist.");
  return res.send(faculty);
});

// get the current faculty account
router.get("/:id", async (req, res) => {
  const faculty = await Faculties.findById(req.params.id);
  if (!faculty) return res.status(400).send("This user does not exist.");
  return res.send(faculty);
});

// get all the faculties
router.get("/", async (req, res) => {
  const faculties = await Faculties.find();
  if (!faculties) return res.status(400).send("No record yet.");
  return res.send(faculties);
});

// activate faculty account
router.get("/activate-account/:id", async (req, res) => {
  let faculty = await Faculties.findById(req.params.id);
  if (!faculty) return res.status(404).send("User does not exist.");

  faculty.isActivated = true;
  await faculty.save();
  sendMail(
    faculty.email,
    process.env.LOGIN_LINK,
    "Approved",
    "Proceed to Login",
    faculty?._id
  );
  return res.send(faculty);
});

// reject faculty
router.delete("/reject-faculty/:id", async (req, res) => {
  const faculty = await Faculties.findByIdAndDelete(req.params.id);
  if (!faculty) return res.status(400).send("This user does not exist.");

  sendMail(
    faculty.email,
    process.env.REGISTER_LINK,
    "Rejected",
    "Try registering again",
    faculty?._id
  );
  return res.send(faculty);
});

// forgot password
router.get("/forgot-password/:email", async (req, res) => {
  const { email } = req.params;

  const faculty = await Faculties.findOne({ email: email });
  if (!faculty) return res.status(400).send("This user does not exist.");

  const mail = sendMail(
    email,
    process.env.FACULTY_RECOVERY,
    "Recover you account.",
    "Start Recovering",
    faculty._id
  );

  if (!mail)
    return res
      .status(400)
      .send("something went wrong. please try again later.");

  return res.send("Check your email for further details.");
});

// change password
router.patch("/change-password/:id", async (req, res) => {
  const faculty = await Faculties.findById(req.params.id);
  if (!faculty) return res.status(400).send("This user does not exist.");

  const salt = await bcrypt.genSalt(10);
  faculty.password = await bcrypt.hash(req.body.password, salt);

  await faculty.save();
  return res.send(faculty);
});

// delete faculty account
router.delete("/:id", async (req, res) => {
  const faculty = await Faculties.findByIdAndDelete(req.params.id);
  if (!faculty) return res.status(400).send("User does not exist.");
  return res.send(faculty);
});

module.exports = router;
