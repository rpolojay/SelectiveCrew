import { notFound } from 'next/navigation';
import { posts } from '../posts';

// ── Post data (mirrored from blog/page.jsx) ──────────────────────────────────
const POST_META = [
  {
    id: 'how-to-get-cruise-ship-job',
    title: 'How to Get a Cruise Ship Job: The Complete Guide for Latin Americans',
    description: 'Everything you need to know to land your first cruise ship job — from requirements to your first day on board. Free guide from Selective Crew.',
    keywords: 'how to get cruise ship job, cruise ship jobs latin america, cruise ship requirements, selective crew, starboard cruise services jobs',
    date: 'March 10, 2026',
    category: 'Getting Started',
  },
  {
    id: 'life-on-cruise-ship',
    title: 'What Is Life Really Like on a Cruise Ship? An Honest Guide',
    description: 'The truth about living and working on a cruise ship — the good, the challenging, and everything in between. Real insights from Selective Crew.',
    keywords: 'life on cruise ship, cruise ship crew life, living on cruise ship, cruise ship work conditions',
    date: 'March 5, 2026',
    category: 'Life On Board',
  },
  {
    id: 'cruise-ship-salary-guide',
    title: 'Cruise Ship Salary Guide 2026: Real Paychecks Revealed',
    description: 'The advertised salary is almost never what you actually take home. Here is the truth about cruise ship salaries, commissions, and take-home pay.',
    keywords: 'cruise ship salary, cruise ship pay, starboard cruise services salary, retail sales cruise ship income, cruise ship commission',
    date: 'February 28, 2026',
    category: 'Salaries',
  },
  {
    id: 'video-interview-tips',
    title: 'Cruise Ship Video Interview Tips: How to Stand Out',
    description: 'Top tips for your cruise ship video interview. Learn what recruiters look for and how to present yourself confidently on camera.',
    keywords: 'cruise ship video interview, cruise ship interview tips, selective crew interview, starboard interview',
    date: 'February 20, 2026',
    category: 'Interview Tips',
  },
  {
    id: 'retail-sales-cruise-ship',
    title: 'Retail Sales on a Cruise Ship: What You Need to Know',
    description: 'Everything about working as a retail sales associate on a cruise ship — duties, commissions, products, and how to get hired.',
    keywords: 'retail sales cruise ship, cruise ship retail, duty free sales cruise, starboard retail sales associate',
    date: 'February 15, 2026',
    category: 'Career Guide',
  },
  {
    id: 'cruise-ship-jobs-colombia',
    title: 'How to Apply for a Cruise Ship Job from Colombia: Step by Step',
    description: 'A complete guide for Colombians who want to work on a cruise ship. From the application to boarding. Free guide by Selective Crew.',
    keywords: 'cruise ship jobs Colombia, trabajo en crucero Colombia, Selective Crew Colombia, Starboard Colombia, como aplicar crucero Colombia',
    date: 'May 20, 2026',
    category: 'Country Guide',
  },
  {
    id: 'cruise-ship-interview-tips',
    title: 'How to Pass a Cruise Ship Interview: 10 Tips That Work',
    description: 'What cruise ship recruiters actually look for — and how to present yourself to get selected on your first try.',
    keywords: 'cruise ship interview tips, how to pass cruise ship interview, cruise ship recruiter, Selective Crew interview',
    date: 'May 19, 2026',
    category: 'Interview Tips',
  },
  {
    id: 'starboard-cruise-services-guide',
    title: 'Starboard Cruise Services: What You Need to Know Before Applying',
    description: 'Everything about working for Starboard — salary, ships, contract length, commissions, and how to get hired through Selective Crew.',
    keywords: 'Starboard Cruise Services, starboard cruise services jobs, starboard retail sales, cruise ship retail jobs',
    date: 'May 18, 2026',
    category: 'Company Guide',
  },
  {
    id: 'duty-free-sales-cruise-ship-salary',
    title: 'Duty Free Sales on a Cruise Ship: Salary, Commissions and Reality',
    description: 'What duty-free sales associates on cruise ships really earn — base salary, commissions, and take-home pay breakdown.',
    keywords: 'duty free sales cruise ship salary, cruise ship retail salary, starboard commission, cruise ship sales income',
    date: 'May 17, 2026',
    category: 'Salaries',
  },
  {
    id: 'after-cruise-ship-job-offer',
    title: 'What Happens After You Get a Cruise Ship Job Offer?',
    description: 'Step by step — what to expect after being selected for a cruise ship job, from document collection to boarding day.',
    keywords: 'cruise ship job offer process, cruise ship documents, C1/D visa cruise ship, boarding cruise ship job',
    date: 'May 16, 2026',
    category: 'Process Guide',
  },
  {
    id: 'cruise-ship-jobs-peru-ecuador-chile',
    title: 'Cruise Ship Jobs from Peru, Ecuador and Chile: How to Apply',
    description: 'A country guide for candidates from Peru, Ecuador, and Chile who want to work on cruise ships with Selective Crew.',
    keywords: 'cruise ship jobs Peru, cruise ship jobs Ecuador, cruise ship jobs Chile, trabajo crucero Peru Ecuador Chile',
    date: 'May 15, 2026',
    category: 'Country Guide',
  },

  {
    id: 'cruise-ship-jobs-colombia',
    title: 'How to Apply for a Cruise Ship Job from Colombia: Step by Step',
    description: 'A complete guide for Colombians who want to work on a cruise ship. From the application to boarding. Free guide by Selective Crew.',
    keywords: 'cruise ship jobs Colombia, trabajo en crucero Colombia, Selective Crew Colombia, Starboard Colombia',
    date: 'May 20, 2026',
    category: 'Country Guide',
  },
  {
    id: 'cruise-ship-interview-tips',
    title: 'How to Pass a Cruise Ship Interview: 10 Tips That Work',
    description: 'What cruise ship recruiters actually look for — and how to present yourself to get selected on your first try.',
    keywords: 'cruise ship interview tips, how to pass cruise ship interview, cruise ship recruiter',
    date: 'May 19, 2026',
    category: 'Interview Tips',
  },
  {
    id: 'starboard-cruise-services-guide',
    title: 'Starboard Cruise Services: What You Need to Know Before Applying',
    description: 'Everything about working for Starboard — salary, ships, contract length, commissions, and how to get hired.',
    keywords: 'Starboard Cruise Services jobs, starboard retail sales, cruise ship retail jobs',
    date: 'May 18, 2026',
    category: 'Company Guide',
  },
  {
    id: 'duty-free-sales-cruise-ship-salary',
    title: 'Duty Free Sales on a Cruise Ship: Salary, Commissions and Reality',
    description: 'What duty-free sales associates on cruise ships really earn — base salary, commissions, and take-home pay breakdown.',
    keywords: 'duty free sales cruise ship salary, cruise ship retail salary, starboard commission',
    date: 'May 17, 2026',
    category: 'Salaries',
  },
  {
    id: 'after-cruise-ship-job-offer',
    title: 'What Happens After You Get a Cruise Ship Job Offer?',
    description: 'Step by step — what to expect after being selected for a cruise ship job, from document collection to boarding day.',
    keywords: 'cruise ship job offer process, cruise ship documents, boarding cruise ship job',
    date: 'May 16, 2026',
    category: 'Process Guide',
  },
  {
    id: 'cruise-ship-jobs-peru-ecuador-chile',
    title: 'Cruise Ship Jobs from Peru, Ecuador and Chile: How to Apply',
    description: 'A country guide for candidates from Peru, Ecuador, and Chile who want to work on cruise ships with Selective Crew.',
    keywords: 'cruise ship jobs Peru, cruise ship jobs Ecuador, cruise ship jobs Chile',
    date: 'May 15, 2026',
    category: 'Country Guide',
  },
  {
    id: 'photographer-cruise-ship',
    title: 'Cruise Ship Photographer Jobs: The Complete Guide',
    description: 'How to become a cruise ship photographer with Norwegian Cruise Line. Requirements, salary, and how to apply through Selective Crew.',
    keywords: 'cruise ship photographer, NCL photographer jobs, Norwegian cruise line photographer, cruise ship photography career',
    date: 'February 10, 2026',
    category: 'Photography',
  },
];

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = POST_META.find(p => p.id === slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url: 'https://selectivecrew.com/blog/' + post.id,
      siteName: 'SelectiveCrew',
      type: 'article',
      publishedTime: post.date,
    },
    alternates: { canonical: 'https://selectivecrew.com/blog/' + post.id },
  };
}

export async function generateStaticParams() {
  return POST_META.map(p => ({ slug: p.id }));
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = POST_META.find(p => p.id === slug);
  if (!post) notFound();
  // Full article body comes from the shared data used by /blog; posts has an
  // empty array slot, hence the `a &&` guard.
  const article = posts.find(a => a && a.id === slug);
  if (!article || !article.content_en || article.content_en.length === 0) notFound();

  // Consecutive "li" blocks are grouped into one <ul>.
  const bodyGroups = [];
  article.content_en.forEach(block => {
    const last = bodyGroups[bodyGroups.length - 1];
    if (block.type === 'li' && last && last.type === 'ul') last.items.push(block.text);
    else if (block.type === 'li') bodyGroups.push({ type: 'ul', items: [block.text] });
    else bodyGroups.push(block);
  });

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Selective Crew', url: 'https://selectivecrew.com' },
    publisher: { '@type': 'Organization', name: 'Selective Crew', url: 'https://selectivecrew.com' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://selectivecrew.com/blog/' + post.id },
  });

  return (
    <div style={{background:'#fff',minHeight:'100vh'}}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <div style={{background:'linear-gradient(135deg,#0a1628,#0e4d8a)',padding:'60px 24px 48px',textAlign:'center'}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#c9a84c',textTransform:'uppercase',marginBottom:12}}>{post.category} · {post.date}</div>
          <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'clamp(24px,4vw,40px)',fontWeight:700,color:'#f8f4ec',lineHeight:1.25,marginBottom:16}}>{post.title}</h1>
          <p style={{fontSize:16,color:'rgba(248,244,236,0.7)',maxWidth:600,margin:'0 auto',lineHeight:1.7}}>{post.description}</p>
        </div>
      </div>
      <div style={{maxWidth:760,margin:'0 auto',padding:'48px 24px'}}>
        <div style={{marginBottom:24}}>
          {bodyGroups.map((block, i) => (
            block.type === 'h3' ? <h2 key={i} style={{fontSize:20,fontWeight:700,color:'#0a1628',margin:'28px 0 12px',fontFamily:"'Playfair Display',serif"}}>{block.text}</h2> :
            block.type === 'ul' ? <ul key={i} style={{paddingLeft:20,margin:'0 0 16px'}}>{block.items.map((text, j) => <li key={j} style={{fontSize:15,color:'#374151',lineHeight:1.7,marginBottom:8}}>{text}</li>)}</ul> :
            <p key={i} style={{fontSize:15,color:'#374151',lineHeight:1.85,marginBottom:16}}>{block.text}</p>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginBottom:40}}>
          {[
            {href:'/cruise-ship-retail-sales-career',label:'Retail Sales Career Guide'},
            {href:'/fast-track-manager',label:'Fast Track Manager'},
            {href:'/cruise-ship-photographer-jobs',label:'Photographer Jobs'},
            {href:'/apply',label:'Apply Now — Free'},
          ].map(link=>(
            <a key={link.href} href={link.href} style={{display:'block',background:'#f8faff',border:'1px solid #e2e8f0',borderRadius:12,padding:'16px 20px',textDecoration:'none',color:'#0a1628',fontSize:14,fontWeight:600}}>
              {link.label} →
            </a>
          ))}
        </div>
        <a href="/blog" style={{display:'inline-flex',alignItems:'center',gap:8,color:'#0e4d8a',fontSize:14,fontWeight:600,textDecoration:'none'}}>← Back to all articles</a>
      </div>
    </div>
  );
}
