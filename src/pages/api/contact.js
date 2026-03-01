import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTACT_TO_EMAIL =
  process.env.CONTACT_FORM_TO_EMAIL || "developertrey@gmail.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message, recaptchaToken } = req.body;

  // Validate inputs
  if (
    !name ||
    !email ||
    !message ||
    !recaptchaToken ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    typeof recaptchaToken !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "All fields are required, including reCAPTCHA." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "Please provide a valid email address." });
  }

  // Verify reCAPTCHA server-side
  try {
    const recaptchaRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${encodeURIComponent(
          process.env.RECAPTCHA_SECRET_KEY
        )}&response=${encodeURIComponent(recaptchaToken)}`,
      }
    );
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success) {
      return res
        .status(400)
        .json({ error: "reCAPTCHA verification failed. Please try again." });
    }
  } catch (err) {
    console.error("reCAPTCHA verification error:", err);
    return res
      .status(500)
      .json({ error: "Failed to verify reCAPTCHA. Please try again later." });
  }

  // Send email via Resend
  try {
    await resend.emails.send({
      from: "Contact Form <contact@treyrader.dev>",
      to: CONTACT_TO_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      replyTo: email,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding:32px 40px 24px;">
                  <h2 style="margin:0 0 24px;font-size:20px;color:#1a1a1a;">New Contact Form Submission</h2>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #eee;">
                        <strong style="color:#555;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Name</strong>
                        <p style="margin:4px 0 0;font-size:15px;color:#1a1a1a;">${name}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #eee;">
                        <strong style="color:#555;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Email</strong>
                        <p style="margin:4px 0 0;font-size:15px;color:#1a1a1a;"><a href="mailto:${email}" style="color:#2563eb;text-decoration:none;">${email}</a></p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;">
                        <strong style="color:#555;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Message</strong>
                        <p style="margin:4px 0 0;font-size:15px;color:#1a1a1a;line-height:1.6;white-space:pre-wrap;">${message}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Resend email error:", err);
    return res
      .status(500)
      .json({ error: "Failed to send email. Please try again later." });
  }
}
