const express = require("express");
const brcypt = require("bcrypt");
const router = express.Router();

const { Deans } = require("../models/Deans");
const { Faculties } = require("../models/Faculties");
const { Admins } = require("../models/Admins");

// deans auth
router.post("/dean", async (req, res) => {
  const { email, password, position } = req.body;

  const dean = await Deans.findOne({ email, position });
  if (!dean) return res.status(400).send("Invalid Credentials.");

  if (!dean.isActivated)
    return res
      .status(400)
      .send(
        "The admin will verify the validity of your account. The admin will send you an e-mail about the decistion."
      );

  const validPassword = await brcypt.compare(password, dean.password);

  if (!validPassword)
    return res.status(400).send("Invalid username or Password.");

  const token = dean.generateAuthToken();
  res.send(token);
});

// faculty auth
router.post("/faculty", async (req, res) => {
  const { email, password } = req.body;

  const faculty = await Faculties.findOne({ email });
  if (!faculty) return res.status(400).send("Invalid Credentials.");

  if (!faculty.isActivated)
    return res
      .status(400)
      .send(
        "The admin will verify the validity of your account. the admin will send you an e-mail about the decision."
      );

  const validPassword = await brcypt.compare(password, faculty.password);

  if (!validPassword)
    return res.status(400).send("Invalid username or password.");

  const token = faculty.generateAuthToken();
  res.send(token);
});

// admin auth
router.post("/admin", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admins.findOne({ email });
  if (!admin) return res.status(404).send("This user does not exist.");

  if (admin.password === password) return res.send(admin);
  return res.status(400).send("Invalid email or password");
});

module.exports = router;
