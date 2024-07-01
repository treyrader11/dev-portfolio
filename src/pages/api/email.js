// import { userData } from "@/lib/data";
import Email from "@/lib/emails";
// import { Resend } from "resend";
// import WaitlistEmail from "@/lib/emails/waitlist";
const { userData } = require("@/lib/data");
// const Email = require("@/lib/emails");
const { Resend } = require("resend");
const WaitlistEmail = require("@/lib/emails/waitlist");

const resend = new Resend(process.env.RESEND_API_KEY);
let email;

export default async function handler(req, res) {
  // if (req.method !== "POST") {
  //   return res.status(405).json({ error: "Method not allowed" });
  // }

  let email;

  if (req.method !== "POST") {
    email = "treyrdr09@gmail.com"
  } else {
    email = req.body.email
  }

  // const { email, subject } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const data = await resend.emails.send({
      // from: "Acme <onboarding@resend.dev>",
      from: email,
      to: ["developertrey@gmail.com"],
      subject: "Hello world",
      // react: Email({ email }),
      react: <Email email={email} />,
    });
    console.log("Email sent successfully with this data:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(error.response?.status || 500).json({
      error: error.response ? JSON.parse(error.response.text) : error.message,
    });
  }
}

// async function handler(req, res) {
//   if (req.method !== "POST") {
//     email = "treyrdr09@gmail.com";
//   } else {
//     email = req.body.email;
//   }

//   if (!email) {
//     return res.status(400).json({ error: "Email is required" });
//   }

//   try {
//     const data = await resend.emails.send({
//       from: email,
//       to: ["developertrey@gmail.com"],
//       subject: "Hello world",
//       react: React.createElement(Email, { email }),
//     });
//     console.log("Email sent successfully with this data:", data);
//     res.status(200).json(data);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(error.response?.status || 500).json({
//       error: error.response ? JSON.parse(error.response.text) : error.message,
//     });
//   }
// }

// module.exports = handler;
