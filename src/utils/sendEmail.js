const nodemailer = require("nodemailer");
const { config } = require("../config/config");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: config.service,
    auth: {
      user: config.email,
      pass: config.pass,
    },
  });

  const message = {
    from: `<${config.email}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

module.exports = { sendEmail };
