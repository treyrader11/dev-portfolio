import type { ContactRequestBody, ContactSuccessResponse } from "@/types/api";

export const sendContactForm = async (
  data: ContactRequestBody
): Promise<ContactSuccessResponse> =>
  fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to send message");
    return res.json() as Promise<ContactSuccessResponse>;
  });
