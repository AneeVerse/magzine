import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function GET() {
  try {
    const file = await readFile(
      path.join(process.cwd(), "public", "rise-magazine.pdf"),
    );
    return new Response(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="BNI-RISE-Magazine.pdf"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return Response.redirect("https://rise.nmbts.co.in/", 302);
  }
}
