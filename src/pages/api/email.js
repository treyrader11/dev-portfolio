import { userData } from "@/lib/data";
import Email from "@/lib/emails";

const { Resend } = require("resend");
// import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // if (req.method !== "POST") {
  //   return res.status(405).json({ error: "Method not allowed" });
  // }

  const { name, email, subject, message } = req.body;
  console.log(
    "email:",
    email,
    "subject:",
    subject,
    "name:",
    name,
    "message:",
    message
  );

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: email,
      to: [userData.email],
      subject,
      react: (
        <Email name={name} email={email} subject={subject} message={message} />
      ),
    });
    if (error) {
      res.status(400).json({ error });
    }
    console.log("data after submitted", data);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(400).json({ error });
    // let errorMessage;
    // try {
    //   const responseText = err.response ? await err.response.text() : null;
    //   errorMessage = responseText ? JSON.parse(responseText) : err.message;
    // } catch (jsonError) {
    //   errorMessage = err.message || "Unexpected error occurred";
    // }

    // res.status(err.response?.status || 500).json({
    //   error: errorMessage,
    // });
  }
}
