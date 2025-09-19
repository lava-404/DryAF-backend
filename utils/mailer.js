require('dotenv').config();
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY, // set in your .env file
});

const sendHydrationEmail = async (to, subject, text) => {
  try {
    const result = await mg.messages.create("sandboxcdddeb338ff14e5995c3f970ae0a1d38.mailgun.org", {
      from: "DryAF <no-reply@sandboxcdddeb338ff14e5995c3f970ae0a1d38.mailgun.org>",
      to,
      subject,
      text,
    });

    console.log("Email sent successfully ✅", result);
  } catch (err) {
    console.error("Email failed ❌", err);
  }
};

module.exports = sendHydrationEmail;
