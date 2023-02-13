const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationToken = async (mail, token) => {
  console.log(process.env.SENDGRID_API_KEY);
  const msg = {
    to: mail,
    from: "dabsko85@gmail.com",
    subject: "Email verification",
    text: `Let's verify your email address`,
    html: `<strong>Click the following link to confirm your email address <a href=${`http://localhost:3000/api/users/verify/${token}`}>VERIFY</a></strong>`,
  };
  await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = { sendVerificationToken };
