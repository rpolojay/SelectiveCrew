import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://selectivecrew.com';
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/jobs`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/apply`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/apply-photographer`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/jobs/retail-sales-associate`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/jobs/fine-jewelry-specialist`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/jobs/assistant-retail-sales-manager`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/jobs/photographer-ncl`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/is-selective-crew-legit`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/talent-pool`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/employers`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
