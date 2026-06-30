import type { NextApiRequest, NextApiResponse } from "next";
import { cloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/features/admin/lib/admin-auth";

// Signs Cloudinary upload params for the admin upload widget. The actual file
// bytes go straight from the browser to Cloudinary — never through our server —
// using this short-lived signature. Admin-only.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    return res.status(500).json({ error: "Cloudinary is not configured" });
  }

  const { paramsToSign } = req.body as {
    paramsToSign?: Record<string, unknown>;
  };
  if (!paramsToSign) {
    return res.status(400).json({ error: "Missing paramsToSign" });
  }

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
  return res.status(200).json({ signature });
}
