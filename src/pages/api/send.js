// Resend docs example: https://github.com/resend/resend-examples/blob/main/with-react-email/src/pages/api/send.ts

import { userData } from "@/lib/data";
import WaitlistEmail from "@/lib/emails/waitlist";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const send = async (req, res) => {
  const { method } = req;
  const { email, subject } = req.body;
  console.log("email:", email, "subject:", subject);

  // switch (method) {
  //   case "GET": {
  //     const data = await resend.emails.send({
  //       // from: "Acme <onboarding@resend.dev>",
  //       from: email,
  //       // to: ["delivered@resend.dev"],
  //       to: [userData.email],
  //       subject: "Waitlist",
  //       react: WaitlistEmail({ name: "Test name" }),
  //     });

  //     return res.status(200).send({ data: data.id });
  //   }
  //   default:
  //     res.setHeader("Allow", ["POST"]);
  //     res.status(405).end(`Method ${method} Not Allowed`);
  // }

  const data = await resend.emails.send({
    // from: "Acme <onboarding@resend.dev>",
    from: email,
    // to: ["delivered@resend.dev"],
    to: [userData.email],
    subject: "Waitlist",
    react: WaitlistEmail({ name: "Test name" }),
  });

  return res.status(200).send({ data: data.id });
};

export default send;
