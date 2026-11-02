import { readFile } from "node:fs/promises";

const key = process.env.DOUBLETICK_API_KEY;
if (!key) {
  console.error("Missing DOUBLETICK_API_KEY");
  process.exit(1);
}

const bytes = await readFile("public/assets/rise-cover.jpg");
const form = new FormData();
form.append("file", new Blob([bytes], { type: "image/jpeg" }), "rise-cover.jpg");

const upload = await fetch("https://public.doubletick.io/media/upload", {
  method: "POST",
  headers: { Authorization: key },
  body: form,
});
const uploadText = await upload.text();
console.log("UPLOAD", upload.status, uploadText.slice(0, 400));
if (!upload.ok) process.exit(1);

const mediaUrl = JSON.parse(uploadText).mediaUrl;
const payload = {
  name: "rise_magazine_delivery",
  language: "en",
  category: "UTILITY",
  allowCategoryUpdate: true,
  wabaNumbers: ["+919136887730"],
  components: {
    header: {
      format: "IMAGE",
      example: { link: mediaUrl },
    },
    body: {
      text: "Hi {{Name}}, here's your copy of BNI RISE.\n\nShort on time? Start with page 11, Navi Mumbai's Moment.\n\nReading about BNI is one thing. Seeing a meeting is another. Come as our guest, once, and judge for yourself.",
      example: { Name: "Rahul" },
    },
    footer: { text: "Reply STOP to opt out" },
    buttons: [
      {
        type: "URL",
        text: "Download RISE",
        url: "https://rise.bninavimumbai.in/{{1}}",
        example: "magazine",
      },
      {
        type: "URL",
        text: "Book a guest visit",
        url: "https://rise.bninavimumbai.in/visit/{{1}}",
        example: "guest",
      },
    ],
  },
};

const created = await fetch("https://public.doubletick.io/template", {
  method: "POST",
  headers: { Authorization: key, "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
const createdText = await created.text();
console.log("CREATE", created.status, createdText.slice(0, 800));
if (!created.ok) process.exit(1);
