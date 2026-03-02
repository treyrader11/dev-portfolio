import type { NextApiRequest, NextApiResponse } from "next";

export interface ContactRequestBody {
  name: string;
  email: string;
  message: string;
  recaptchaToken: string;
}

export interface ContactSuccessResponse {
  success: true;
  message: string;
}

export interface ContactErrorResponse {
  error: string;
}

export type ContactResponse = ContactSuccessResponse | ContactErrorResponse;

export interface EmailRequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SendRequestBody {
  email: string;
  subject: string;
}

export interface AddSubscriptionRequestBody {
  email: string;
}

export interface RecaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export type TypedApiHandler<TBody = unknown, TResponse = unknown> = (
  req: NextApiRequest & { body: TBody },
  res: NextApiResponse<TResponse>
) => Promise<void> | void;
