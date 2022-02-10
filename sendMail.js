const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve("./views"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views"),
  extName: ".handlebars",
};

transporter.use("compile", hbs(handlebarOptions));

async function sendMail(recipient, link, heading, title, id) {
  const mail = {
    to: recipient,
    from: `"EARIST OPCR ✅" <${process.env.USER_EMAIL}>`,
    subject: "A message from EARIST OPCR",
    template: "email",
    context: {
      link: link,
      heading: heading,
      title: title,
      id: id,
    },
  };
  try {
    let info = await transporter.sendMail(mail);
    console.log("message sent ", info.messageId);
    return info.messageId;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = sendMail;
