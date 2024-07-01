import Email from "@/lib/emails";

const { userData } = require("@/lib/data");
const { Resend } = require("resend");
const WaitlistEmail = require("@/lib/emails/waitlist");

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
    const data = await resend.emails.send({
      from: `${email}`,
      to: [`${userData.email}`],
      subject,
      react: (
        <Email name={name} email={email} subject={subject} message={message} />
      ),
    });
    console.log("Email sent successfully with this data:", data);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error sending email:", err);

    let errorMessage;
    try {
      errorMessage = err.response ? await err.response.text() : err.message;
      errorMessage = JSON.parse(errorMessage);
    } catch (jsonError) {
      errorMessage = err.message || "Unexpected error occurred";
    }

    res.status(err.response?.status || 500).json({
      error: errorMessage,
    });
  }
}
