import "server-only";

const GOOGLE_SHEETS_WEBHOOK_URL =
  process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL ||
  "";

function logPrefix(context: string) {
  return context ? `[Google Sheets] ${context}` : "[Google Sheets]";
}

export async function sendToGoogleSheets(
  payload: Record<string, unknown>,
  context = "",
): Promise<boolean> {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    console.warn(
      `${logPrefix(context)} Missing webhook URL. Set GOOGLE_SHEETS_WEBHOOK_URL in .env.local`,
    );
    return false;
  }

  if (GOOGLE_SHEETS_WEBHOOK_URL.includes("YOUR_")) {
    console.warn(`${logPrefix(context)} Placeholder webhook URL — deploy Apps Script first.`);
    return false;
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000),
      redirect: "follow",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        `${logPrefix(context)} Request failed`,
        response.status,
        errorText.slice(0, 200),
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(`${logPrefix(context)} Request error`, error);
    return false;
  }
}

export { GOOGLE_SHEETS_WEBHOOK_URL };
