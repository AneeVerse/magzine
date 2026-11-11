import { redirect } from "next/navigation";

export default async function VisitPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const ending = slug?.[0] || "guest";
  redirect(`/?src=wa_visit&book=visit&path=${encodeURIComponent(ending)}`);
}
