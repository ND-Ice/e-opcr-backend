const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { Deans, validate } = require("../models/Deans");
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
    const dean = await Deans.findById(req.params.id);
    if (!dean) return res.status(400).send("user does not exist");
    dean.image.current = `https://e-ipcr-backend.herokuapp.com/${req.file.path}`;
    await dean.save();
    return res.send(dean);
  }
);

// create dean account
router.post("/", async (req, res) => {
  const {
    firstName,
    lastName,
    middleName,
    email,
    dept,
    password,
    birthDate,
    position,
  } = req.body;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let dean = await Deans.findOne({
    email,
    firstName,
    lastName,
    middleName,
    dept,
    position,
  });
  if (dean) return res.status(400).send("This user already exist");

  dean = new Deans({
    email,
    name: { firstName, lastName, middleName },
    dept,
    password,
    birthDate,
    position,
  });

  const salt = await bcrypt.genSalt(10);
  dean.password = await bcrypt.hash(dean.password, salt);
  await dean.save();

  return res.send(
    "The admin will verify the validity of your account. Please wait up to 1-2 working days for the admin decision."
  );
});

// update dean primary account account
router.patch("/:id", async (req, res) => {
  const { contact, houseNumber, street, barangay, city, province } = req.body;
  const dean = await Deans.findById(req.params.id);
  if (!dean) return res.status(404).send("user does not exist");

  dean.contact = contact;
  dean.address.houseNumber = houseNumber;
  dean.address.street = street;
  dean.address.barangay = barangay;
  dean.address.city = city;
  dean.address.province = province;
  await dean.save();
  return res.send(dean);
});

// update dean basic info
router.put("/:id", async (req, res) => {
  const dean = await Deans.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!dean) return res.status(400).send("user does not exist");
  return res.send(dean);
});

// get the current dean
router.get("/:id", async (req, res) => {
  const dean = await Deans.findById(req.params.id);
  if (!dean) return res.status(400).send("This user does not exist.");
  return res.send(dean);
});

// get all the deans
router.get("/", async (req, res) => {
  const deans = await Deans.find();
  if (!deans) return res.status(400).send("No records yet.");
  return res.send(deans);
});

// activate dean account
router.get("/activate-account/:id", async (req, res) => {
  let dean = await Deans.findById(req.params.id);
  if (!dean) return res.status(404).send("User does not exist.");

  dean.isActivated = true;
  await dean.save();
  sendMail(
    dean.email,
    process.env.LOGIN_LINK_DEAN,
    "Approved",
    "Proceed to Login",
    dean?._id
  );
  return res.send(dean);
});

// reject dean
router.delete("/reject-dean/:id", async (req, res) => {
  const dean = await Deans.findByIdAndDelete(req.params.id);
  if (!dean) return res.status(400).send("This user does not exist.");

  sendMail(
    dean.email,
    process.env.REGISTER_LINK_DEAN,
    "Rejected",
    "Try registering again",
    dean?._id
  );
  return res.send(dean);
});

// forgot password
router.get("/forgot-password/:email", async (req, res) => {
  const { email } = req.params;

  const dean = await Deans.findOne({ email });
  if (!dean) return res.status(400).send("This user does not exist.");

  const mail = sendMail(
    email,
    process.env.DEAN_RECOVERY,
    "Recover you Account.",
    "Start Recovering",
    dean._id
  );

  if (!mail)
    return res
      .status(400)
      .send("something went wrong. please try again later.");

  return res.send("Check your email for further details.");
});

// change password
router.patch("/change-password/:id", async (req, res) => {
  const dean = await Deans.findById(req.params.id);
  if (!dean) return res.status(400).send("This user does not exist.");

  const salt = await bcrypt.genSalt(10);
  dean.password = await bcrypt.hash(req.body.password, salt);

  await dean.save();
  return res.send(dean);
});

// delete dean account
router.delete("/:id", async (req, res) => {
  const dean = await Deans.findByIdAndDelete(req.params.id);
  if (!dean) return res.status(400).send("User does not exist");
  return res.send(dean);
});

module.exports = router;
