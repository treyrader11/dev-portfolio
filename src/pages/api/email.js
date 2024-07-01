import Email from "@/lib/emails";

const { userData } = require("@/lib/data");
const { Resend } = require("resend");
const WaitlistEmail = require("@/lib/emails/waitlist");

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, subject } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const data = await resend.emails.send({
      from: email,
      to: ["developertrey@gmail.com", userData.email],
      subject: "Hello world",
      react: <Email email={email} />,
    });
    console.log("Email sent successfully with this data:", data);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error sending email:", err);

    let errorMessage;
    try {
      errorMessage = err.response
        ? JSON.parse(err.response.text)
        : err.message;
    } catch (jsonError) {
      errorMessage = "Unexpected error occurred";
    }

    res.status(err.response?.status || 500).json({
      error: errorMessage,
    });
  }
}
