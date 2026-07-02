import type { MetadataRoute } from "next";

const BASE = "https://lmapping.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/notation`, changeFrequency: "weekly", priority: 0.8 },
  ];
}
