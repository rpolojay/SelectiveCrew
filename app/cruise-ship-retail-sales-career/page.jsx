'use client';
import { useState } from 'react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: 'Cruise Ship Retail Sales Associate',
  description: 'Guest-facing, commission-eligible retail sales role onboard cruise ships with Starboard Cruise Services and Harding Retail. Responsibilities include guest conversion, upselling duty-free products, hitting sales targets, maintaining displays, and working in a high-volume onboard retail environment.',
  datePosted: '2026-04-01',
  validThrough: '2026-12-31',
  employmentType: 'CONTRACTOR',
  hiringOrganization: { '@type': 'Organization', name: 'Selective Crew', sameAs: 'https://selectivecrew.com' },
  jobLocation: { '@type': 'Place', name: 'Onboard — International Cruise Fleet' },
  applicantLocationRequirements: { '@type': 'Country', name: 'Latin America' },
  baseSalary: { '@type': 'MonetaryAmount', currency: 'USD', value: { '@type': 'QuantitativeValue', minValue: 900, maxValue: 1500, unitText: 'MONTH' } },
  skills: 'Retail sales, upselling, guest interaction, English communication, product knowledge, visual merchandising, sales targets',
};

const CLUSTER_LINKS = [
  { href: '/blog/cruise-ship-salary-guide', label: 'Salary, commissions & tips guide' },
  { href: '/blog/retail-sales-cruise-ship', label: 'How to get hired as a retail sales associate' },
  { href: '/blog/video-interview-tips', label: 'Top interview questions for cruise sales roles' },
  { href: '/blog/retail-sales-cruise-ship', label: 'What cruise retail managers look for' },
  { href: '/blog/life-on-cruise-ship', label: 'Cruise retail vs land-based retail' },
  { href: '/blog/how-to-get-cruise-ship-job', label: 'How to present your sales experience in a CV' },
];

const STEPS = [
  { n: '01', title: 'Submit your sales profile', desc: 'Name, country, WhatsApp, retail background — takes under 3 minutes.' },
  { n: '02', title: 'Share your sales experience', desc: 'Tell us about your category, targets, and conversion experience.' },
  { n: '03', title: 'English and guest-facing screening', desc: 'We assess your English level and guest interaction confidence before moving forward.' },
  { n: '04', title: 'Match to current or upcoming roles', desc: 'We match your profile to active Starboard, Harding, or NCL openings.' },
  { n: '05', title: 'Recruiter interview and next steps', desc: 'Video interview with our team. We guide you through every document and embarkation step.' },
];

const FAQS = [
  { q: 'Do I need cruise ship experience?', a: 'No. Strong retail or sales experience on land is valued. What matters most is your sales track record, English ability, and guest-facing confidence.' },
  { q: 'Is this commission-based?', a: 'Yes. Compensation typically includes a base salary plus performance-based commissions tied to individual or team sales targets. Your earnings are directly linked to results.' },
  { q: 'Do I need to speak English?', a: 'Yes. Intermediate to advanced English is required. You will be interacting with international guests daily, recommending products, handling objections, and processing sales in English.' },
  { q: 'Is this luxury retail?', a: 'It depends on the brand and ship. Onboard retail typically covers duty-free products including perfumes, spirits, cosmetics, jewelry, watches, and apparel. Luxury product knowledge is a strong advantage.' },
  { q: 'How long are the contracts?', a: 'Typical contracts run 4 to 8 months onboard. You will live and work on the ship for the duration. Meals and accommodation are included.' },
  { q: 'Can hospitality workers apply?', a: 'Yes, especially candidates with guest-facing sales experience in hotels, F&B, or luxury hospitality. The crossover between hospitality service and retail sales is valued.' },
  { q: 'Is this similar to working in land-based retail?', a: 'The sales fundamentals are the same — targets, product knowledge, guest conversion — but the environment is faster, more international, and performance is tracked more closely. Read our comparison guide for the full picture.' },
];


function scoreApplication(form) {
  let score = 0;
  const eng = (form.english || form.englishLevel || '').toLowerCase();
  if (eng.includes('advanced') || eng.includes('fluent') || eng.includes('avanzado')) score += 40;
  else if (eng.includes('intermediate') || eng.includes('intermedio') || eng.includes('upper')) score += 25;
  else if (eng.includes('basic') || eng.includes('basico')) score += 10;
  const exp = (form.salesExp || form.salesExperience || form.experience || '').toLowerCase();
  if (exp.includes('5+') || exp.includes('5 y') || exp.includes('more than 4') || exp.includes('mas de 4')) score += 30;
  else if (exp.includes('3-5') || exp.includes('3 a 5') || exp.includes('3') || exp.includes('4')) score += 22;
  else if (exp.includes('1-2') || exp.includes('1 a 2') || exp.includes('1') || exp.includes('2')) score += 15;
  else if (exp.includes('less') || exp.includes('menos') || exp.includes('<1')) score += 5;
  const passport = (form.passport || '').toLowerCase();
  if (passport.includes('valid') || passport.includes('vigente') || passport.includes('yes') || passport.includes('si')) score += 20;
  else if (passport.includes('process') || passport.includes('proceso') || passport.includes('applying')) score += 10;
  else score += 2;
  const avail = (form.availability || '').toLowerCase();
  if (avail.includes('immediately') || avail.includes('inmediato') || avail.includes('now') || avail.includes('ahora')) score += 10;
  else if (avail.includes('1-2') || avail.includes('1 a 2') || avail.includes('month')) score += 7;
  else if (avail.includes('3-6') || avail.includes('3 a 6')) score += 4;
  else score += 1;
  const grade = score >= 75 ? 'A' : score >= 45 ? 'B' : 'C';
  return { score, grade };
}

export default function RetailSalesCareerPage() {
  const [form, setForm] = useState({ name:'', country:'', whatsapp:'', email:'', salesExp:'', english:'', category:'', passport:'', availability:'' });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  function handleResume(file) {
    if (!file) return;
    setResumeFile(file);
    const reader = new FileReader();
    reader.onload = () => setResumeBase64(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  }
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeBase64, setResumeBase64] = useState('');
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!resumeBase64) { alert('Please upload your resume before submitting.'); return; }
    const LATAM_COUNTRIES = ["Colombia","Peru","Ecuador","Chile","Argentina","Mexico","Panama","Costa Rica","Dominican Republic","Venezuela","Uruguay","Paraguay"];
    const countryVal = form.country || formData?.country || '';
    if (countryVal && !LATAM_COUNTRIES.includes(countryVal)) {
      alert('We are currently recruiting from Latin America only. Unfortunately we cannot process your application at this time.');
      return;
    }
    
    setBusy(true);
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'careers@selectivecrew.com',
          subject: 'Retail Sales Application - ' + form.name + ' (' + form.country + ')',
          text: 'RETAIL SALES APPLICATION\n\nName: ' + form.name + '\nCountry: ' + form.country
            + '\nWhatsApp: ' + form.whatsapp + '\nEmail: ' + form.email
            + '\nSales Experience: ' + form.salesExp + '\nEnglish Level: ' + form.english
            + '\nProduct Category: ' + form.category + '\nPassport: ' + form.passport
            + '\nAvailability: ' + form.availability
            + '\n\nSource: selectivecrew.com/cruise-ship-retail-sales-career',
          attachments: resumeBase64 ? [{filename: resumeFile ? resumeFile.name : 'resume.pdf', content: resumeBase64}] : [],
        }),
      });
      const { score, grade } = scoreApplication(form);
      await addDoc(collection(db, 'retailSalesApplications'), { ...form, score, grade, source: 'cruise-ship-retail-sales-career', submittedAt: serverTimestamp() });
      await addDoc(collection(db, 'applications'), { fullName: form.name, email: form.email, whatsapp: form.whatsapp, country: form.country, position: 'Retail Sales Associate', status: 'new', score, grade, english: form.english, salesExp: form.salesExp, passport: form.passport, availability: form.availability, source: 'cruise-ship-retail-sales-career', createdAt: serverTimestamp() });
      setSubmitted(true);
    } catch (err) {
      alert('Something went wrong. Please contact us on WhatsApp: +57 318 847 4058');
    } finally {
      setBusy(false);
    }
  }

  const inp = { width:'100%', padding:'11px 14px', border:'1px solid #d1d9e6', borderRadius:8, fontSize:14, fontFamily:'inherit', color:'#0a1628', background:'#f8fafc', boxSizing:'border-box', outline:'none' };
  const sel = { ...inp, appearance:'none', cursor:'pointer' };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .rc-container { max-width: 960px; margin: 0 auto; padding: 0 24px; }
        .rc-serif { font-family: 'Playfair Display', Georgia, serif; }
        .rc-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; }
        .rc-tag { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #64748b; background: #f1f5f9; border-radius: 100px; padding: 4px 12px; }
        .rc-btn-primary { display: inline-flex; align-items: center; gap: 8px; background: #0d9488; color: #fff; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; font-family: inherit; text-decoration: none; border: none; cursor: pointer; transition: background 0.2s; }
        .rc-btn-primary:hover { background: #0f766e; }
        .rc-btn-outline { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: #f8f4ec; padding: 13px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; font-family: inherit; text-decoration: none; border: 1.5px solid rgba(248,244,236,0.25); cursor: pointer; }
        .rc-check { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
        .rc-faq-item { border-bottom: 1px solid #f1f5f9; padding: 20px 0; }
        .rc-faq-item:last-child { border-bottom: none; }
        .rc-step { display: flex; gap: 20px; align-items: flex-start; padding: 20px 0; border-bottom: 1px solid #f1f5f9; }
        .rc-step:last-child { border-bottom: none; }
        .rc-step-num { width: 44px; height: 44px; border-radius: 50%; background: #0d9488; color: #fff; font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .rc-sticky { display: none; }
        @media (max-width: 768px) {
          .rc-hero-grid { grid-template-columns: 1fr !important; }
          .rc-two-col { grid-template-columns: 1fr !important; }
          .rc-three-col { grid-template-columns: 1fr !important; }
          .rc-sticky { display: flex; position: fixed; bottom: 0; left: 0; right: 0; padding: 14px 20px; background: rgba(10,22,40,0.97); backdrop-filter: blur(8px); border-top: 1px solid rgba(255,255,255,0.1); z-index: 90; gap: 10px; }
          .rc-sticky a, .rc-sticky button { flex: 1; text-align: center; justify-content: center; font-size: 13px; padding: 12px; }
        }
      `}</style>

      {/* -- HERO -- */}
      <section style={{ background:'linear-gradient(160deg,#0a1628 0%,#0d2240 55%,#0d4a6e 100%)', padding:'72px 24px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
        <div style={{ position:'absolute', top:'10%', right:'-5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(13,148,136,0.08) 0%,transparent 70%)' }} />

        <div className="rc-container" style={{ position:'relative' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(13,148,136,0.15)', border:'1px solid rgba(13,148,136,0.3)', borderRadius:100, padding:'5px 14px', marginBottom:20 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#14b8a6' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#5eead4', letterSpacing:1.5 }}>SELECTIVE CREW · RETAIL SALES RECRUITMENT · LATIN AMERICA</span>
          </div>

          <div className="rc-hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:56, alignItems:'center' }}>
            <div>
              <h1 className="rc-serif" style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:700, color:'#f8f4ec', lineHeight:1.15, marginBottom:20 }}>
                Cruise Ship Retail Sales Career<br />
                <span style={{ color:'#14b8a6' }}>for Latin American Candidates</span>
              </h1>
              <p style={{ fontSize:16, color:'rgba(248,244,236,0.65)', lineHeight:1.8, marginBottom:32, maxWidth:540 }}>
                A performance-based retail sales role onboard international cruise ships. You will sell duty-free products to guests, hit daily targets, handle objections, and earn commission on top of your base salary. This role is for candidates who are motivated by results — not just the location.
              </p>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:36 }}>
                <a href="#apply" className="rc-btn-primary">Apply for Retail Sales Roles</a>
                <a href="#requirements" className="rc-btn-outline">See Requirements</a>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px 24px' }}>
                {[
                  ['Performance-based commissions','Your earnings reflect your results'],
                  ['Guest-facing retail and product sales','High-volume, fast-paced environment'],
                  ['English and sales confidence required','Intermediate to advanced minimum'],
                  ['Long-contract, international setting','4 to 8 months onboard per contract'],
                ].map(([title,sub]) => (
                  <div key={title} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:'#14b8a6', flexShrink:0, marginTop:7 }} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#f8f4ec' }}>{title}</div>
                      <div style={{ fontSize:12, color:'rgba(248,244,236,0.45)', lineHeight:1.5 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role card */}
            <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'28px 24px' }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:'#14b8a6', textTransform:'uppercase', marginBottom:16 }}>Open Retail Roles</div>
              {[
                { title:'Retail Sales Associate', partner:'Starboard Cruise Services', tag:'Worldwide', color:'#0d9488' },
                { title:'Onboard Sales Associate', partner:'Harding Retail', tag:'Various fleets', color:'#0d9488' },
                { title:'Photo Sales Associate', partner:'NCL Photo Dept.', tag:'Norwegian fleet', color:'#6366f1' },
              { title:'Expedition Sales Associate', partner:'Grand Circle Cruise Line', tag:'New partner', color:'#c9a84c' },
                { title:'Asst. Retail Manager', partner:'Starboard Cruise Services', tag:'Fast Track', color:'#c9a84c' },
              ].map(role => (
                <div key={role.title} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#f8f4ec' }}>{role.title}</div>
                    <div style={{ fontSize:11, color:'rgba(248,244,236,0.4)' }}>{role.partner}</div>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:100, background:`rgba(${role.color==='#0d9488'?'13,148,136':role.color==='#6366f1'?'99,102,241':'201,168,76'},0.15)`, color:role.color }}>{role.tag}</span>
                </div>
              ))}
              <div style={{ marginTop:20, background:'rgba(13,148,136,0.1)', border:'1px solid rgba(13,148,136,0.2)', borderRadius:10, padding:'12px 14px' }}>
                <div style={{ fontSize:12, color:'#5eead4', lineHeight:1.6 }}>
                  <strong style={{ display:'block', marginBottom:4 }}>Free to apply. Always.</strong>
                  Selective Crew never charges candidates. Voluntarily aligned with MLC 2006 standards.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- WHAT THIS JOB REALLY IS -- */}
      <section style={{ padding:'72px 24px', background:'#fff' }}>
        <div className="rc-container">
          <span className="rc-tag" style={{ marginBottom:12, display:'inline-block' }}>Role Reality</span>
          <h2 className="rc-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#0a1628', marginBottom:12 }}>What this job really is</h2>
          <p style={{ fontSize:15, color:'#64748b', marginBottom:36, maxWidth:640, lineHeight:1.7 }}>
            Cruise retail is not passive shop work. It is a high-volume, guest-conversion environment where your results are tracked daily and your commissions reflect your performance. If you have worked in retail with targets, this environment will feel familiar — but more intensive.
          </p>
          <div className="rc-three-col" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {[
              { icon:'??', title:'Target-driven sales', desc:'Daily and weekly sales targets. Your performance against those targets determines your commission earnings.' },
              { icon:'???', title:'Guest conversion', desc:'Approach guests, recommend products, handle objections, and close sales. Upselling is a core part of the role.' },
              { icon:'??', title:'Product knowledge', desc:'Perfumes, spirits, cosmetics, watches, jewelry, and apparel. You will be trained and expected to sell with confidence.' },
              { icon:'???', title:'Visual merchandising', desc:'Maintain attractive product displays, manage stock on the floor, and ensure the retail environment meets brand standards.' },
              { icon:'??', title:'Transaction processing', desc:'Process sales, handle currency and card transactions, and maintain accurate records across a busy retail shift.' },
              { icon:'?', title:'High-volume environment', desc:'Thousands of guests onboard. Multiple daily port days. Fast pace, long shifts, and consistent guest-facing pressure.' },
            ].map(item => (
              <div key={item.title} className="rc-card" style={{ borderLeft:'3px solid #0d9488' }}>
                <div style={{ fontSize:26, marginBottom:10 }}>{item.icon}</div>
                <div style={{ fontSize:14, fontWeight:700, color:'#0a1628', marginBottom:6 }}>{item.title}</div>
                <div style={{ fontSize:13, color:'#64748b', lineHeight:1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- WHO SUCCEEDS -- */}
      <section style={{ padding:'72px 24px', background:'#f8fafc' }}>
        <div className="rc-container">
          <span className="rc-tag" style={{ marginBottom:12, display:'inline-block' }}>Candidate Profile</span>
          <h2 className="rc-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#0a1628', marginBottom:12 }}>Who succeeds in this role</h2>
          <p style={{ fontSize:15, color:'#64748b', marginBottom:36, maxWidth:640, lineHeight:1.7 }}>
            The candidates who perform well in cruise retail share a specific profile. It is not about personality alone — it is about sales mindset, resilience, and guest-facing confidence under pressure.
          </p>
          <div className="rc-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
            <div className="rc-card">
              <div style={{ fontSize:13, fontWeight:700, color:'#0d9488', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>Strong candidate profile</div>
              {[
                'Persuasive, energetic, and goal-oriented',
                'Comfortable approaching guests without prompting',
                'Strong English — speaks with confidence in guest interactions',
                'Used to retail KPIs, targets, or customer conversion metrics',
                'Polished personal presentation — appearance matters onboard',
                'Resilient under pressure and consistent over long contracts',
                'Motivated by commission earnings and performance recognition',
              ].map(item => (
                <div key={item} className="rc-check">
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'#f0fdf9', border:'1px solid #0d9488', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize:14, color:'#334155', lineHeight:1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="rc-card">
              <div style={{ fontSize:13, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>Less competitive profile</div>
              {[
                'No retail or sales experience of any kind',
                'Passive customer service only — no sales responsibility',
                'Basic English only — cannot communicate with international guests',
                'Motivated primarily by travel rather than sales performance',
                'Not comfortable approaching strangers or initiating sales',
                'Unable to commit to 4+ month onboard contracts',
                'No product knowledge or interest in learning duty-free categories',
              ].map(item => (
                <div key={item} className="rc-check">
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'#fef2f2', border:'1px solid #fca5a5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 3L7 7M7 3L3 7" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <span style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -- SALARY & COMMISSIONS -- */}
      <section style={{ padding:'72px 24px', background:'#fff' }}>
        <div className="rc-container">
          <span className="rc-tag" style={{ marginBottom:12, display:'inline-block' }}>Compensation</span>
          <h2 className="rc-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#0a1628', marginBottom:12 }}>Salary, commissions, and growth</h2>
          <p style={{ fontSize:15, color:'#64748b', marginBottom:36, maxWidth:640, lineHeight:1.7 }}>
            Cruise retail compensation is structured differently from land-based retail. Understanding how it works helps you evaluate whether this career fits your financial goals.
          </p>
          <div className="rc-three-col" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:32 }}>
            {[
              { title:'Base salary', desc:'A fixed monthly base is paid regardless of sales performance. This covers your guaranteed earnings for the contract duration.', note:'Meals and accommodation are included — your take-home is closer to net savings.' },
              { title:'Performance commissions', desc:'On top of base salary, commissions are earned based on individual or team sales targets. Higher performance equals higher earnings.', note:'Commission structures vary by partner — Starboard and Harding each have their own models.' },
              { title:'Career growth', desc:'Strong performers move into specialist roles, supervisory positions, or management tracks within 1 to 2 contracts. Starboard Fast Track is one example.', note:'Onboard retail is one of the fastest promotion paths in the cruise industry.' },
            ].map(item => (
              <div key={item.title} className="rc-card">
                <div style={{ fontSize:14, fontWeight:700, color:'#0a1628', marginBottom:8 }}>{item.title}</div>
                <div style={{ fontSize:13, color:'#64748b', lineHeight:1.65, marginBottom:10 }}>{item.desc}</div>
                <div style={{ fontSize:12, color:'#0d9488', background:'#f0fdf9', border:'1px solid #ccfbf1', borderRadius:8, padding:'8px 12px', lineHeight:1.5 }}>{item.note}</div>
              </div>
            ))}
          </div>
          <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderLeft:'4px solid #f59e0b', borderRadius:'0 12px 12px 0', padding:'16px 20px', display:'flex', gap:14 }}>
            <span style={{ fontSize:20, flexShrink:0 }}>??</span>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#0a1628', marginBottom:4 }}>Want the full salary breakdown?</div>
              <div style={{ fontSize:13, color:'#64748b', lineHeight:1.6 }}>
                Read our detailed guide: <Link href="/blog" style={{ color:'#0d9488', fontWeight:600 }}>Cruise retail salary, commissions and tips — what to expect</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- REQUIREMENTS -- */}
      <section id="requirements" style={{ padding:'72px 24px', background:'#f8fafc' }}>
        <div className="rc-container">
          <span className="rc-tag" style={{ marginBottom:12, display:'inline-block' }}>Eligibility</span>
          <h2 className="rc-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#0a1628', marginBottom:36 }}>Minimum Requirements</h2>
          <div className="rc-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
            <div className="rc-card">
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#0a1628', marginBottom:20 }}>Required</div>
              {[
                '1+ year in retail, sales, or customer-facing role',
                'Intermediate to advanced English — guest interaction daily',
                'Comfort with upselling, promotions, and closing sales',
                'Valid passport and international travel readiness',
                'Ability to commit to a 4 to 8 month onboard contract',
                'Confidence approaching guests and initiating conversations',
              ].map(item => (
                <div key={item} className="rc-check">
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'#f0fdf9', border:'1px solid #0d9488', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize:14, color:'#334155', lineHeight:1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="rc-card">
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#64748b', marginBottom:20 }}>Preferred — strengthens your application</div>
              {[
                'Luxury, cosmetics, fragrance, or duty-free retail experience',
                'Airport or travel retail background',
                'Hospitality or hotel guest-services experience',
                'Familiarity with sales KPIs, conversion rates, or targets',
                'Second language beyond Spanish (French, Italian, Portuguese)',
                'Visual merchandising or product display experience',
              ].map(item => (
                <div key={item} className="rc-check">
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'#f8fafc', border:'1px solid #cbd5e1', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -- PARTNER OPPORTUNITIES -- */}
      <section style={{ padding:'72px 24px', background:'#fff' }}>
        <div className="rc-container">
          <span className="rc-tag" style={{ marginBottom:12, display:'inline-block' }}>Partner Opportunities</span>
          <h2 className="rc-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#0a1628', marginBottom:12 }}>Where we place retail candidates</h2>
          <p style={{ fontSize:15, color:'#64748b', marginBottom:36, maxWidth:640, lineHeight:1.7 }}>
            Selective Crew screens and prepares Latin American candidates for retail sales opportunities with leading cruise retail operators. We do not promise placement — we prepare and present strong candidates for active openings.
          </p>
          <div className="rc-three-col" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {[
              {
                name:'Starboard Cruise Services',
                desc:'The leading onboard retailer across multiple major cruise lines. Roles include Retail Sales Associate, Duty-Free Specialist, and Fast Track Assistant Manager. High-volume, target-driven environment with commission structures.',
                tags:['Duty-free sales','Cosmetics & fragrance','Watches & jewelry','Management track'],
                color:'#0d9488',
              },
              {
                name:'Harding Retail',
                desc:'A major onboard retail operator with a strong presence across various fleets. Guest-facing sales roles with a focus on product knowledge, promotions, and guest conversion in a busy retail environment.',
                tags:['Onboard retail','Promotional sales','Guest conversion','Multi-category'],
                color:'#0d9488',
              },
              {
                name:'NCL Photo Department',
                desc:'Norwegian Cruise Line\'s photography department involves both guest-facing photography and selling photo products in the onboard gallery. Candidates with retail sales experience and guest-interaction confidence are competitive.',
                tags:['Photo sales','Guest interaction','Gallery retail','Norwegian fleet'],
                color:'#6366f1',
              },
            ].map(partner => (
              <div key={partner.name} className="rc-card">
                <div style={{ fontSize:15, fontWeight:700, color:'#0a1628', marginBottom:8 }}>{partner.name}</div>
                <div style={{ fontSize:13, color:'#64748b', lineHeight:1.65, marginBottom:16 }}>{partner.desc}</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {partner.tags.map(tag => (
                    <span key={tag} style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:100, background:'#f0fdf9', color:'#0d9488', border:'1px solid #ccfbf1' }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* TESTIMONIALS */}
      <section style={{ padding:'72px 24px', background:'#f8fafc' }}>
        <div className="rc-container">
          <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#64748b', background:'#fff', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Real Results</span>
          <h2 className="rc-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#0a1628', marginBottom:8 }}>Real people. Real results.</h2>
          <p style={{ fontSize:15, color:'#64748b', marginBottom:36, lineHeight:1.7 }}>Join 2,000+ candidates already working at sea.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
            {[
              { name:'Ruben De Jesus Hernandez', role:'Sales Associate', company:'Starboard Cruise Services', country:'Colombia ????', quote:'The agency is very professional and the staff is very friendly. Placed within 3 weeks.' },
              { name:'Shalom Coba', role:'Sales Associate', company:'Harding Retail', country:'Colombia ????', quote:'Selective Crew helped me get a job on a cruise ship and now I am traveling the world. Placed within a month.' },
              { name:'Evelin Hidalgo', role:'Retail Supervisor', company:'Starboard Cruise Services', country:'Colombia ????', quote:'Went from applicant to Retail Supervisor within her first year.' },
            ].map(t => (
              <div key={t.name} className="rc-card" style={{ borderLeft:'3px solid #0d9488' }}>
                <div style={{ display:'flex', gap:2, marginBottom:12 }}>
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color:'#0d9488', fontSize:14 }}>?</span>)}
                </div>
                <p style={{ fontSize:14, color:'#334155', lineHeight:1.7, marginBottom:16, fontStyle:'italic' }}>"{t.quote}"</p>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#0a1628' }}>{t.name}</div>
                  <div style={{ fontSize:12, color:'#64748b' }}>{t.role} · {t.company}</div>
                  <div style={{ fontSize:12, color:'#94a3b8' }}>{t.country}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* -- SCREENER FORM -- */}
      <section id="apply" style={{ padding:'72px 24px', background:'#0a1628' }}>
        <div className="rc-container" style={{ maxWidth:680 }}>
          <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Apply Now</span>
          <h2 className="rc-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#f8f4ec', marginBottom:8 }}>Start your retail sales application</h2>
          <p style={{ fontSize:15, color:'rgba(248,244,236,0.55)', marginBottom:32, lineHeight:1.7 }}>Takes under 4 minutes. No documents needed in this step.</p>

          {submitted ? (
            <div style={{ background:'rgba(13,148,136,0.12)', border:'1px solid rgba(13,148,136,0.25)', borderRadius:16, padding:'40px 32px', textAlign:'center' }}>
              <div style={{ fontSize:40, marginBottom:16 }}>?</div>
              <div style={{ fontSize:20, fontFamily:'Playfair Display,serif', color:'#f8f4ec', marginBottom:10 }}>Application received</div>
              <p style={{ fontSize:14, color:'rgba(248,244,236,0.65)', lineHeight:1.7 }}>Our recruiter will review your profile and sales experience within 3 to 5 business days. We will contact you via WhatsApp or email with next steps.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'32px 28px', display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Full name *</label><input name="name" value={form.name} onChange={handle} required style={inp} placeholder="Your full name"/></div>
                <div><label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Country *</label>
                  <select name="country" value={form.country} onChange={handle} required style={sel}>
                    <option value="">Select country</option>
                    {['Colombia','Peru','Ecuador','Chile','Argentina','Mexico','Panama','Costa Rica','Dominican Republic','Venezuela','Uruguay',].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>WhatsApp *</label><input name="whatsapp" value={form.whatsapp} onChange={handle} required style={inp} placeholder="+57 300 000 0000"/></div>
                <div><label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Email *</label><input name="email" type="email" value={form.email} onChange={handle} required style={inp} placeholder="your@email.com"/></div>
              </div>
              <div><label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Years of retail or sales experience *</label>
                <select name="salesExp" value={form.salesExp} onChange={handle} required style={sel}>
                  <option value="">Select</option>
                  <option>Less than 1 year</option>
                  <option>1-2 years</option>
                  <option>2-4 years</option>
                  <option>5+ years</option>
                </select>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>English level *</label>
                  <select name="english" value={form.english} onChange={handle} required style={sel}>
                    <option value="">Select level</option>
                    <option>Basic — simple phrases</option>
                    <option>Intermediate — can communicate with guests</option>
                    <option>Advanced — fully confident</option>
                    <option>Native / Fluent</option>
                  </select>
                </div>
                <div><label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Product category sold *</label>
                  <select name="category" value={form.category} onChange={handle} required style={sel}>
                    <option value="">Select main category</option>
                    <option>Fashion / Apparel</option>
                    <option>Cosmetics / Fragrance / Beauty</option>
                    <option>Jewelry / Watches</option>
                    <option>Electronics / Technology</option>
                    <option>Spirits / Food & Beverage</option>
                    <option>Airport / Travel Duty-Free</option>
                    <option>General retail / Supermarket</option>
                    <option>Hospitality / F&B service</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Passport status *</label>
                  <select name="passport" value={form.passport} onChange={handle} required style={sel}>
                    <option value="">Select</option>
                    <option>Valid passport — ready to travel</option>
                    <option>Passport in process</option>
                    <option>No passport yet</option>
                  </select>
                </div>
                <div><label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Availability *</label>
                  <select name="availability" value={form.availability} onChange={handle} required style={sel}>
                    <option value="">Select</option>
                    <option>Immediately available</option>
                    <option>Available in 1-2 months</option>
                    <option>Available in 3-6 months</option>
                    <option>Just exploring options</option>
                  </select>
                </div>
              </div>
              
        <div style={{marginBottom:20}}>
          <label style={{display:'block',fontSize:13,fontWeight:600,color:'#0a1628',marginBottom:6}}>Resume / CV <span style={{color:'#e85d4a'}}>*</span></label>
          <div onClick={()=>document.getElementById('resumeInputretail').click()}
            style={{border:'2px dashed '+(resumeFile?'#0d9488':'#c8d6f0'),borderRadius:12,padding:'20px',textAlign:'center',cursor:'pointer',background:resumeFile?'#f0fdf9':'#fafbff'}}>
            {resumeFile
              ? <p style={{fontSize:13,color:'#0d9488',fontWeight:600,margin:0}}>{resumeFile.name}</p>
              : <p style={{fontSize:13,color:'#94a3b8',margin:0}}>Click to upload your resume (PDF, DOC, DOCX)</p>
            }
          </div>
          <input id="resumeInputretail" type="file" accept=".pdf,.doc,.docx" style={{display:'none'}} onChange={e=>handleResume(e.target.files[0])}/>
        </div>
        <button type="submit" disabled={busy} className="rc-btn-primary" style={{ justifyContent:'center', marginTop:4 }}>
                {busy ? 'Submitting...' : 'Start Retail Sales Application ->'}
              </button>
              <div style={{ fontSize:12, color:'rgba(248,244,236,0.3)', textAlign:'center' }}>Free to apply. No documents required in this step. We never share your data.</div>
            </form>
          )}
        </div>
      </section>

      {/* -- PROCESS -- */}
      <section style={{ padding:'72px 24px', background:'#f8fafc' }}>
        <div className="rc-container" style={{ maxWidth:680 }}>
          <span className="rc-tag" style={{ marginBottom:12, display:'inline-block' }}>Process</span>
          <h2 className="rc-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#0a1628', marginBottom:8 }}>How the application works</h2>
          <p style={{ fontSize:15, color:'#64748b', marginBottom:36, lineHeight:1.7 }}>Transparent, structured, and free at every step.</p>
          <div className="rc-card">
            {STEPS.map(s => (
              <div key={s.n} className="rc-step">
                <div className="rc-step-num">{s.n}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#0a1628', marginBottom:4 }}>{s.title}</div>
                  <div style={{ fontSize:13, color:'#64748b', lineHeight:1.65 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- FAQ -- */}
      <section style={{ padding:'72px 24px', background:'#fff' }}>
        <div className="rc-container" style={{ maxWidth:720 }}>
          <span className="rc-tag" style={{ marginBottom:12, display:'inline-block' }}>FAQ</span>
          <h2 className="rc-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#0a1628', marginBottom:36 }}>Common questions</h2>
          <div className="rc-card">
            {FAQS.map(faq => (
              <div key={faq.q} className="rc-faq-item">
                <div style={{ fontSize:15, fontWeight:700, color:'#0a1628', marginBottom:8 }}>{faq.q}</div>
                <div style={{ fontSize:14, color:'#64748b', lineHeight:1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- CLUSTER LINKS -- */}
      <section style={{ padding:'56px 24px', background:'#f8fafc' }}>
        <div className="rc-container">
          <span className="rc-tag" style={{ marginBottom:12, display:'inline-block' }}>Related Guides</span>
          <h2 className="rc-serif" style={{ fontSize:'clamp(20px,3vw,28px)', color:'#0a1628', marginBottom:24 }}>Everything you need to know about cruise retail sales</h2>
          <div className="rc-two-col" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
            {CLUSTER_LINKS.map(link => (
              <Link key={link.href} href={link.href} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, textDecoration:'none', transition:'all 0.2s', gap:12 }}
                onMouseOver={e=>{ e.currentTarget.style.borderColor='#0d9488'; e.currentTarget.style.transform='translateY(-1px)'; }}
                onMouseOut={e=>{ e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.transform='none'; }}>
                <span style={{ fontSize:14, fontWeight:600, color:'#0a1628', lineHeight:1.4 }}>{link.label}</span>
                <span style={{ color:'#0d9488', fontSize:16, flexShrink:0 }}>?</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -- FINAL CTA -- */}
      <section style={{ padding:'72px 24px', background:'#0a1628', textAlign:'center' }}>
        <div className="rc-container" style={{ maxWidth:600 }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(13,148,136,0.15)', border:'1px solid rgba(13,148,136,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:22 }}>???</div>
          <h2 className="rc-serif" style={{ fontSize:'clamp(22px,3.5vw,36px)', color:'#f8f4ec', marginBottom:12 }}>Ready to apply for cruise retail sales roles?</h2>
          <p style={{ fontSize:15, color:'rgba(248,244,236,0.55)', lineHeight:1.8, marginBottom:32 }}>Free to apply. Sales-first screening. Our recruiter responds within 3 to 5 business days.</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="#apply" className="rc-btn-primary">Start Retail Sales Application</a>
            <a href="#requirements" className="rc-btn-outline">Check Role Requirements</a>
          </div>
          <div style={{ marginTop:28, display:'flex', justifyContent:'center', flexWrap:'wrap', gap:20 }}>
            {['Free to apply','Sales-first review','Response in 3-5 days'].map(f=>(
              <span key={f} style={{ fontSize:12, color:'rgba(248,244,236,0.35)', display:'flex', alignItems:'center', gap:6 }}><span style={{ color:'#14b8a6' }}>?</span> {f}</span>
            ))}
          </div>
          <div style={{ marginTop:32, paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize:12, color:'rgba(248,244,236,0.3)', marginBottom:10 }}>Also hiring</div>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/fast-track-manager" style={{ fontSize:13, color:'rgba(248,244,236,0.5)', textDecoration:'none', padding:'6px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:100 }}>? Fast Track Manager</Link>
              <Link href="/cruise-ship-photographer-jobs" style={{ fontSize:13, color:'rgba(248,244,236,0.5)', textDecoration:'none', padding:'6px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:100 }}>?? Photographer Jobs</Link>
              <Link href="/jobs" style={{ fontSize:13, color:'rgba(248,244,236,0.5)', textDecoration:'none', padding:'6px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:100 }}>All Open Positions</Link>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY */}
      <div className="rc-sticky">
        <a href="#apply" className="rc-btn-primary">Apply for Retail Sales</a>
        <a href="#requirements" className="rc-btn-outline" style={{ flex:1, textAlign:'center', justifyContent:'center', fontSize:13, padding:'12px' }}>Requirements</a>
      </div>
    </>
  );
}




