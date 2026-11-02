"use client";

import { useEffect, useRef } from "react";

type GeoPayload = {
  ip: string;
  city: string;
  region: string;
  country: string;
  pincode: string;
};

async function fetchGeo(): Promise<GeoPayload> {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) throw new Error("geo failed");
    const data = (await response.json()) as Record<string, string>;
    return {
      ip: data.ip || "",
      city: data.city || "",
      region: data.region || "",
      country: data.country_name || data.country || "",
      pincode: data.postal || "",
    };
  } catch {
    return { ip: "", city: "", region: "", country: "", pincode: "" };
  }
}

function attributionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    src: params.get("src")?.slice(0, 200) || "",
    utm_source: params.get("utm_source")?.slice(0, 200) || "",
    utm_medium: params.get("utm_medium")?.slice(0, 200) || "",
    utm_campaign: params.get("utm_campaign")?.slice(0, 200) || "",
  };
}

export function VisitorTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const track = async () => {
      const geo = await fetchGeo();
      await fetch("/api/track-visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...geo,
          ...attributionFromUrl(),
          pageUrl: window.location.href,
          referrer: document.referrer || "Direct",
          userAgent: navigator.userAgent,
        }),
      });
    };

    track().catch(() => {});
  }, []);

  return null;
}
