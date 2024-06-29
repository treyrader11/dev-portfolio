import { userData } from "@/lib/data";
import Email from "@/lib/emails";
import WaitlistEmail from "@/lib/emails/waitlist";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const { email, subject, name, message } = req.body;

  // const email = "treyrdr09@gmail.com";

  if (!email) res.status(400).json({ error: "Email is required" });

  try {
    // const response = await resend.sendEmail({
    //   from: "onboarding@resend.dev",
    //   to: domain,
    //   subject: "hello world",
    //   //   react: Email({ email, subject, name, message }),
    //   react: Email({ subject, name, email }),
    // });

    const data = await resend.emails.send({
      // from: "Acme <onboarding@resend.dev>",
      from: email,
      // to: ["delivered@resend.dev"],
      to: [userData.email],
      subject,
      react: Email({ email }),
    });
    // return res.status(200).send({ data: data.id });
    return res.status(200).send({ data });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      error: error.response ? JSON.parse(error.response.text) : error.message,
    });
  }
}

// const send = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { method } = req;

//   switch (method) {
//     case 'GET': {
//       const data = await resend.emails.send({
//         from: 'Acme <onboarding@resend.dev>',
//         to: ['delivered@resend.dev'],
//         subject: 'Waitlist',
//         react: WaitlistEmail({ name: 'Bu' }),
//       });

//       return res.status(200).send({ data: data.id });
//     }
//     default:
//       res.setHeader('Allow', ['POST']);
//       res.status(405).end(`Method ${method} Not Allowed`);
//   }
// };

// export default send;
