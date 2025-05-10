import { templateInfo } from "@/utils/templateInfo";

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${templateInfo.link}/sitemap.xml`,
  }
} 