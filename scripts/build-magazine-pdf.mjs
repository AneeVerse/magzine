import { readFile, writeFile, mkdir } from "node:fs/promises";
import { PDFDocument } from "pdf-lib";

const images = [
  "public/assets/rise-cover.jpg",
  "public/assets/page-11-moment.jpg",
  "public/assets/page-13-sudeep.jpg",
  "public/assets/page-39-dream.jpg",
  "public/assets/page-44-event.jpg",
];

const pdf = await PDFDocument.create();
for (const path of images) {
  const bytes = await readFile(path);
  const image = await pdf.embedJpg(bytes);
  const page = pdf.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });
}

await mkdir("public", { recursive: true });
const out = await pdf.save();
await writeFile("public/rise-magazine.pdf", out);
console.log("Wrote public/rise-magazine.pdf", out.length, "bytes,", pdf.getPageCount(), "pages");
