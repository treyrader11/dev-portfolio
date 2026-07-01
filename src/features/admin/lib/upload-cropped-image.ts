// Uploads a cropped image blob straight from the browser to Cloudinary using a
// short-lived signature from /api/admin/upload. The file bytes never touch our
// server. Returns the secure URL of the uploaded asset.
//
// Signed upload: we ask the API route to sign { folder, timestamp }, then post
// the blob plus that signature directly to Cloudinary. The params we sign must
// exactly match the non-file params we send.

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

export const cloudinaryConfigured = Boolean(CLOUD_NAME && API_KEY);

export async function uploadCroppedImage(
  blob: Blob,
  folder = "portfolio/experiences",
): Promise<string> {
  if (!CLOUD_NAME || !API_KEY) {
    throw new Error("Cloudinary is not configured");
  }

  const timestamp = Math.round(Date.now() / 1000);

  const signRes = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paramsToSign: { folder, timestamp } }),
  });
  if (!signRes.ok) throw new Error("Could not sign the upload");
  const { signature } = (await signRes.json()) as { signature: string };

  const form = new FormData();
  form.append("file", blob);
  form.append("api_key", API_KEY);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form },
  );
  if (!uploadRes.ok) throw new Error("Upload failed");
  const data = (await uploadRes.json()) as { secure_url: string };
  return data.secure_url;
}
