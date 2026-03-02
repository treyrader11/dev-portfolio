import type { NextApiRequest, NextApiResponse } from "next";
import { userData } from "@/lib/data";
import Email from "@/lib/emails";
import { Resend } from "resend";
import type { EmailRequestBody } from "@/types/api";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailSuccessResponse {
  id: string;
}

interface EmailErrorResponse {
  error: string | Record<string, unknown>;
}

type EmailResponse = EmailSuccessResponse | EmailErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmailResponse>
): Promise<void> {
  const { name, email, subject, message } = req.body as EmailRequestBody;
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
      from: "Trey <noreply@treyrader.dev>",
      to: [userData.email, email],
      subject,
      react: (
        <Email name={name} email={email} />
      ),
    });
    console.log("Email sent successfully with this data:", data);
    res.status(200).json(data as unknown as EmailSuccessResponse);
  } catch (err: unknown) {
    console.error("Error sending email:", err);

    const error = err as { response?: { text?: string; status?: number }; message?: string };

    let errorMessage: string | Record<string, unknown>;
    try {
      const responseText = error.response ? error.response.text : null;
      errorMessage = responseText ? JSON.parse(responseText) as Record<string, unknown> : (error.message || "Unexpected error occurred");
    } catch (_jsonError) {
      errorMessage = error.message || "Unexpected error occurred";
    }

    res.status(error.response?.status || 500).json({
      error: errorMessage,
    });
  }
}
