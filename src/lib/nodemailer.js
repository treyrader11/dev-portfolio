import nodemailer from "nodemailer";

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
  // service: "gmail",
  host: "gmail",
  // secure: process.env.NODE_ENV !== "development",
  auth: {
    user: email,
    // pass,
  },
});

export const mailOptions = {
  from: email,
  to: email,
};
