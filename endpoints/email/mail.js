const nodemailer = require("nodemailer");

const config = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  auth: {
    user: "heroesneverdieoverwatch@outlook.de",
    pass: "Passwort123!",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function sendMail(to, subject, html, content = "") {
  let options = {
    from: "heroesneverdieoverwatch@outlook.de",
    to: to,
    subject: subject,
    text: content,
    html,
  };
  return Promise.resolve(
    config.sendMail(options, (error, info) => {
      if (error) {
        return error;
      }
      return info.response;
    })
  );
}

module.exports = {
  sendMail,
};
