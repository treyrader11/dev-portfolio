import type { NextApiRequest, NextApiResponse } from "next";
import mailchimp from "@mailchimp/mailchimp_marketing";
import type { AddSubscriptionRequestBody } from "@/types/api";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY ?? "",
  server: process.env.MAILCHIMP_API_SERVER ?? "", // e.g. us1
});

interface SubscriptionSuccessResponse {
  response: Record<string, unknown>;
}

interface SubscriptionErrorResponse {
  error: string | Record<string, unknown>;
}

type SubscriptionResponse = SubscriptionSuccessResponse | SubscriptionErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubscriptionResponse>
): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body as AddSubscriptionRequestBody;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID ?? "",
      { email_address: email, status: "subscribed" }
    );

    return res.status(200).json({ response });
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; text?: string }; message?: string };
    return res.status(error.response?.status || 500).json({
      error: error.response?.text ? JSON.parse(error.response.text) as Record<string, unknown> : (error.message || "Unknown error"),
    });
  }
}
