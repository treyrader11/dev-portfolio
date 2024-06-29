// // import { userData } from "@/lib/data";
// // import Email from "@/lib/emails";
// // import WaitlistEmail from "@/lib/emails/waitlist";
// // import { Resend } from "resend";

// // const resend = new Resend(process.env.RESEND_API_KEY);

// // // resend doc

// // export default async (req, res) => {
// //   const { email, subject, name, message } = req.body;

// //   if (!email) res.status(400).json({ error: "Email is required" });

// //   const { data, error } = await resend.emails.send({
// //     from: "Acme <onboarding@resend.dev>",
// //     to: ["trey@treyrader.dev"],
// //     subject: "Hello world",
// //     react: Email({ email }),
// //   });

// //   if (error) {
// //     return res.status(400).json(error);
// //   }

// //   res.status(200).json(data);
// // };

// const { userData } = require("@/lib/data");
// const Email = require("@/lib/emails");
// const { Resend } = require("resend");

// const resend = new Resend(process.env.RESEND_API_KEY);

// module.exports = async (req, res) => {
//   const { email, subject, name, message } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: "Email is required" });
//   }

//   try {
//     const data = await resend.emails.send({
//       from: "Acme <onboarding@resend.dev>",
//       to: ["trey@treyrader.dev"],
//       subject: "Hello world",
//       react: Email({ email }),
//     });
//     console.log('data', data)
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(error.response?.status || 500).json({
//       error: error.response ? JSON.parse(error.response.text) : error.message,
//     });
//   }
// };

// // export default async function handler(req, res) {
// //   const { email, subject, name, message } = req.body;

// //   console.log("API request received with body:", req.body);

// //   if (!email) {
// //     console.log("Email is required but not provided");
// //     return res.status(400).json({ error: "Email is required" });
// //   }

// //   try {
// //     const data = await resend.emails.send({
// //       from: "treyrdr09@gmail.com",
// //       to: [email],
// //       subject: "Hello world",
// //       react: Email({ email }),
// //     });
// //     console.log("Email sent successfully with data:", data);
// //     res.status(200).json(data);
// //   } catch (error) {
// //     console.error("Error sending email:", error);
// //     res.status(error.response?.status || 500).json({
// //       error: error.response ? JSON.parse(error.response.text) : error.message,
// //     });
// //   }
// // }

import { userData } from "@/lib/data";
import Email from "@/lib/emails";
import { Resend } from "resend";
import WaitlistEmail from "@/lib/emails/waitlist";

const resend = new Resend(process.env.RESEND_API_KEY);

// export default async function handler(req, res) {
//   const { email, subject, name, message } = req.body;

//   console.log("API request received with body:", req.body);

//   if (!email) {
//     console.log("Email is required but not provided");
//     return res.status(400).json({ error: "Email is required" });
//   }

//   try {
//     const data = await resend.emails.send({
//       from: "Acme <onboarding@resend.dev>",
//       to: ["trey@treyrader.dev"],
//       subject: "Hello world",
//       react: Email({ email }),
//     });
//     console.log("Email sent successfully with data:", data);
//     res.status(200).json(data);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(error.response?.status || 500).json({
//       error: error.response ? JSON.parse(error.response.text) : error.message,
//     });
//   }
// }

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["trey@treyrader.dev"],
      subject: "Hello world",
      react: Email({ email }),
    });
    console.log("Email sent successfully with data:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(error.response?.status || 500).json({
      error: error.response ? JSON.parse(error.response.text) : error.message,
    });
  }
}
