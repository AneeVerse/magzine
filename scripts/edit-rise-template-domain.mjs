const key = process.env.DOUBLETICK_API_KEY;
if (!key) {
  console.error("Missing DOUBLETICK_API_KEY");
  process.exit(1);
}

const cover =
  "https://data-storage.doubletick.io/org_Hc5cgO40hP/templates/b590a163-8f09-46df-8db7-d1584b544540.jpeg";

const payload = {
  name: "rise_magazine_delivery",
  language: "en",
  category: "MARKETING",
  allowCategoryUpdate: true,
  wabaNumbers: ["+919136887730"],
  components: {
    header: {
      format: "IMAGE",
      example: { link: cover },
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
        url: "https://rise.nmbts.co.in/{{1}}",
        example: "magazine",
      },
      {
        type: "URL",
        text: "Book a guest visit",
        url: "https://rise.nmbts.co.in/visit/{{1}}",
        example: "guest",
      },
    ],
  },
};

const res = await fetch("https://public.doubletick.io/template/3636044", {
  method: "PATCH",
  headers: { Authorization: key, "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
console.log("EDIT", res.status, await res.text());

await new Promise((r) => setTimeout(r, 2500));
const list = await fetch(
  "https://public.doubletick.io/v2/templates?allWabaPhoneNumbers=true",
  { headers: { Authorization: key } },
);
const data = await list.json();
for (const t of data.filter((x) => /rise/i.test(x.name))) {
  const buttons = t.components?.find((c) => c.type === "BUTTON")?.buttons || [];
  console.log(t.name, t.status, buttons.map((b) => b.url).join(" | "));
}
