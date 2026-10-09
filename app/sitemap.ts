import { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://selectivecrew.com';
  const now = new Date();
  return [
    // Core pages
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/jobs`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/apply`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/apply-photographer`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },

    // Job pages
    { url: `${base}/cruise-ship-retail-sales-career`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/fast-track-manager`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/fine-jewelry-cruise-ship-jobs`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/cruise-ship-photographer-jobs`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/japanese-speakers`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/jobs/retail-sales-associate`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/jobs/fine-jewelry-specialist`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/jobs/assistant-retail-sales-manager`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/jobs/photographer-ncl`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // Country pages
    { url: `${base}/cruise-jobs-colombia`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/cruise-jobs-peru`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/cruise-jobs-ecuador`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/cruise-jobs-chile`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/cruise-jobs-argentina`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/cruise-jobs-panama`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/cruise-jobs-dominican-republic`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

    // Blog main + all articles
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog/how-to-get-cruise-ship-job`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/life-on-cruise-ship`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/cruise-ship-salary-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/video-interview-tips`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/retail-sales-cruise-ship`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/photographer-cruise-ship`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/cruise-ship-jobs-colombia`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cruise-ship-interview-tips`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/starboard-cruise-services-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/duty-free-sales-cruise-ship-salary`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/after-cruise-ship-job-offer`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/cruise-ship-jobs-peru-ecuador-chile`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

    // Training
    { url: `${base}/training`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // Employers
    { url: `${base}/employers`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/remote-staffing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // Trust & authority
    { url: `${base}/is-selective-crew-legit`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/talent-pool`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },

    { url: `${base}/empezar`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },

    // Legal
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
