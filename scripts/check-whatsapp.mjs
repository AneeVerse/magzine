// Read-only account diagnostics: this script never sends a message.
const apiKey = process.env.DOUBLETICK_API_KEY;
if (!apiKey) {
  console.error("Set DOUBLETICK_API_KEY in .env.local.");
  process.exitCode = 1;
} else {
  for (const [label, path] of [
    ["Channels", "organization/channel/profile"],
    ["Templates", "v2/templates?allWabaPhoneNumbers=true"],
  ]) {
    try {
      const response = await fetch("https://public.doubletick.io/" + path, {
        headers: { Authorization: apiKey },
        signal: AbortSignal.timeout(10000),
        redirect: "error",
      });
      if (!response.ok) {
        console.error(
          label +
            ": HTTP " +
            response.status +
            (response.status === 403
              ? " — API access is forbidden. Check account/API permissions."
              : ""),
        );
        process.exitCode = 1;
        continue;
      }
      const data = await response.json();
      const entries = label === "Channels" ? data.channels : data;
      if (!Array.isArray(entries)) {
        console.error(label + ": unexpected response shape.");
        process.exitCode = 1;
        continue;
      }
      console.log(label + ": " + entries.length);
      console.table(
        entries.map((item) =>
          label === "Channels"
            ? {
                name: item.displayName,
                number: item.wabaNumber,
                status: item.status,
              }
            : {
                name: item.name,
                language: item.language,
                status: item.status,
                number: item.wabaPhoneNumber,
              },
        ),
      );
    } catch {
      console.error(label + ": request failed. No messages were sent.");
      process.exitCode = 1;
    }
  }
}
