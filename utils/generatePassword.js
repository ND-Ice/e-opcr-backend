const generator = require("generate-password");

function generatePassword(passwordLength) {
  return generator.generate({
    length: passwordLength,
    numbers: true,
  });
}

module.exports = generatePassword;
