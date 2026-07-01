// Turns a source image + the pixel crop region returned by react-easy-crop into
// a square PNG blob, drawn on an offscreen canvas. Output is capped so icons
// stay small regardless of the original file size.
export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MAX_OUTPUT = 512;

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
  const size = Math.min(Math.max(crop.width, crop.height), MAX_OUTPUT);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
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
    size,
    size,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Crop failed"))),
      "image/png",
    );
  });
}
