// Turns a source image + the pixel crop region returned by react-easy-crop into
// a PNG blob, drawn on an offscreen canvas. The crop's aspect ratio is preserved
// (square icons stay square, wide shots stay wide). Output is capped on its
// longest side so uploads stay small regardless of the original file size.
export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MAX_OUTPUT = 1024;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function getCroppedBlob(
  imageSrc: string,
  crop: PixelCrop,
): Promise<Blob> {
  const image = await loadImage(imageSrc);

  // Scale down so the longest side is at most MAX_OUTPUT, keeping the aspect.
  const scale = Math.min(1, MAX_OUTPUT / Math.max(crop.width, crop.height));
  const outW = Math.max(1, Math.round(crop.width * scale));
  const outH = Math.max(1, Math.round(crop.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outW,
    outH,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Crop failed"))),
      "image/png",
    );
  });
}
