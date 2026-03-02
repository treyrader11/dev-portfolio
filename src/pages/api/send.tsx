// Resend docs example: https://github.com/resend/resend-examples/blob/main/with-react-email/src/pages/api/send.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { userData } from "@/lib/data";
import WaitlistEmail from "@/lib/emails/waitlist";
import { Resend } from "resend";
import type { SendRequestBody } from "@/types/api";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendSuccessResponse {
  data: string | undefined;
}

interface SendErrorResponse {
  error: string;
}

type SendResponse = SendSuccessResponse | SendErrorResponse;

const send = async (
  req: NextApiRequest,
  res: NextApiResponse<SendResponse>
): Promise<void> => {
  const { method } = req;
  const { email, subject } = req.body as SendRequestBody;
  console.log("email:", email, "subject:", subject);

  const data = await resend.emails.send({
    from: email,
    to: [userData.email],
    subject: "Waitlist",
    react: WaitlistEmail({ name: "Test name" }),
  });

  return res.status(200).send({ data: data.data?.id });
};

export default send;
