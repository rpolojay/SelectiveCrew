'use client';
import { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: 'Cruise Ship Photographer',
  description: 'Guest-facing photographer and photo sales role onboard Norwegian Cruise Line ships. Responsibilities include portrait and event photography, directing guests, and selling photo products in the onboard gallery. Based at sea, working in a fast-paced hospitality environment.',
  datePosted: '2026-04-01',
  validThrough: '2026-12-31',
  employmentType: 'CONTRACTOR',
  hiringOrganization: {
    '@type': 'Organization',
    name: 'Selective Crew',
    sameAs: 'https://selectivecrew.com',
    logo: 'https://res.cloudinary.com/dr9xpsjmb/image/upload/v1767023146/SC_Enhanced_ssyr8a.jpg',
  },
  jobLocation: {
    '@type': 'Place',
    name: 'Onboard — Norwegian Cruise Line Fleet',
    address: { '@type': 'PostalAddress', addressCountry: 'XZ' },
  },
  applicantLocationRequirements: {
    '@type': 'Country',
    name: 'Latin America',
  },
  baseSalary: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: { '@type': 'QuantitativeValue', minValue: 900, maxValue: 1400, unitText: 'MONTH' },
  },
  skills: 'Portrait photography, event photography, guest interaction, English communication, photo sales',
  qualifications: 'Intermediate to advanced English, valid passport, portrait or event photography experience',
  responsibilities: 'Photograph guests in multiple onboard settings, direct poses, photograph events, sell photo products in the gallery',
};

const STEPS = [
  { n: '01', title: 'Submit quick profile', desc: 'Name, country, WhatsApp, experience level — takes under 3 minutes.' },
  { n: '02', title: 'Share your portfolio', desc: 'Instagram, Behance, website, Drive, or PDF — 10 to 20 strong images minimum.' },
  { n: '03', title: 'Recruiter screening', desc: 'Our team reviews your portfolio and English level before moving forward.' },
  { n: '04', title: 'Active vacancy or talent pool', desc: 'If a role is open you move to interview. If not, we keep your profile for upcoming openings.' },
  { n: '05', title: 'Interview and next steps', desc: 'Video interview with the hiring team. We guide you through every document step.' },
];

const FAQS = [
  { q: 'Do I need cruise ship experience?', a: 'No. Cruise experience helps but is not required. What matters most is portrait or event photography experience, English ability, and confidence working with guests.' },
  { q: 'Do I need to own my own camera?', a: 'In most cases, the cruise line provides professional camera equipment onboard. However, having your own equipment and knowing how to use it professionally strengthens your application.' },
  { q: 'Is this also a sales role?', a: 'Yes. Cruise ship photographers are responsible for selling photo products in the onboard gallery. Guest-facing sales confidence is part of the role. Candidates with retail or service experience are prioritized.' },
  { q: 'What level of English do I need?', a: 'Intermediate to advanced. You will be directing guests in English, interacting with international visitors daily, and communicating with your onboard team. Basic English is not sufficient for this role.' },
  { q: 'Can I apply with only event photography experience?', a: 'Yes, provided you have strong portrait work and can demonstrate guest-facing confidence. Studio-only photographers with no people experience are less competitive for this role.' },
  { q: 'What happens after I submit my application?', a: 'Our recruiter reviews your profile and portfolio within 3 to 5 business days. You will receive a response regardless of outcome. If shortlisted, we schedule a screening call before any interview.' },
];

export default function PhotographerPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', country: '', whatsapp: '', email: '',
    english: '', years: '', type: '', portfolio: '',
    sales: '', passport: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [portfolioCheck, setPortfolioCheck] = useState({
    portraits: false, events: false, lighting: false, online: false,
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getRoute = () => {
    const hasPortfolio = form.portfolio.trim().length > 0;
    const strongEnglish = ['Advanced', 'Intermediate'].includes(form.english);
    const hasSales = form.sales === 'Yes';
    const hasExperience = parseInt(form.years) >= 1;
    if (!hasPortfolio || !hasExperience) return 'prep';
    if (!strongEnglish) return 'pool';
    if (hasSales && hasPortfolio && strongEnglish) return 'priority';
    return 'apply';
  };

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const route = getRoute();
    try {
      // Email first — does not require authentication
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'careers@selectivecrew.com',
          subject: 'New Photographer Application - ' + form.name + ' (' + form.country + ') [' + route.toUpperCase() + ']',
          text: 'NEW PHOTOGRAPHER APPLICATION\n\nPriority: ' + route.toUpperCase()
            + '\n\nName: ' + form.name
            + '\nCountry: ' + form.country
            + '\nWhatsApp: ' + form.whatsapp
            + '\nEmail: ' + form.email
            + '\nEnglish Level: ' + form.english
            + '\nYears of Photography: ' + form.years
            + '\nPhotography Type: ' + form.type
            + '\nPortfolio: ' + form.portfolio
            + '\nSales Experience: ' + form.sales
            + '\nPassport: ' + form.passport
            + '\n\nSource: selectivecrew.com/cruise-ship-photographer-jobs',
        }),
      });
      // Then save to Firestore
      await addDoc(collection(db, 'photographerApplications'), {
        name: form.name, country: form.country, whatsapp: form.whatsapp,
        email: form.email, english: form.english, yearsExperience: form.years,
        photographyType: form.type, portfolioLink: form.portfolio,
        salesExperience: form.sales, passportStatus: form.passport,
        route: route, source: 'cruise-ship-photographer-jobs',
        submittedAt: serverTimestamp(),
      });
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'careers@selectivecrew.com',
          subject: 'New Photographer Application - ' + form.name + ' (' + form.country + ') [' + route.toUpperCase() + ']',
          text: 'NEW PHOTOGRAPHER APPLICATION\n\nPriority: ' + route.toUpperCase()
            + '\n\nName: ' + form.name
            + '\nCountry: ' + form.country
            + '\nWhatsApp: ' + form.whatsapp
            + '\nEmail: ' + form.email
            + '\nEnglish Level: ' + form.english
            + '\nYears of Photography: ' + form.years
            + '\nPhotography Type: ' + form.type
            + '\nPortfolio: ' + form.portfolio
            + '\nSales Experience: ' + form.sales
            + '\nPassport: ' + form.passport
            + '\n\nSource: selectivecrew.com/cruise-ship-photographer-jobs',
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error: ' + err.message + ' — Please screenshot this and contact us on WhatsApp.');
    } finally {
      setBusy(false);
    }
  }

  const inp = {
    width: '100%', padding: '11px 14px',
    border: '1px solid #d1d9e6', borderRadius: 8,
    fontSize: 14, fontFamily: 'inherit', color: '#0a1628',
    background: '#f8fafc', boxSizing: 'border-box',
    outline: 'none',
  };

  const sel = { ...inp, appearance: 'none', cursor: 'pointer' };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        .ph-container { max-width: 960px; margin: 0 auto; padding: 0 24px; }
        .ph-serif { font-family: 'Playfair Display', Georgia, serif; }
        .ph-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; }
        .ph-btn-primary { display: inline-flex; align-items: center; gap: 8px; background: #0a1628; color: #fff; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; font-family: inherit; text-decoration: none; border: none; cursor: pointer; transition: background 0.2s; }
        .ph-btn-primary:hover { background: #1a3a5c; }
        .ph-btn-outline { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: #0a1628; padding: 13px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; font-family: inherit; text-decoration: none; border: 1.5px solid #0a1628; cursor: pointer; transition: all 0.2s; }
        .ph-btn-outline:hover { background: #0a1628; color: #fff; }
        .ph-tag { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #64748b; background: #f1f5f9; border-radius: 100px; padding: 4px 12px; }
        .ph-check { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
        .ph-check-icon { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
        .ph-faq-item { border-bottom: 1px solid #f1f5f9; padding: 20px 0; }
        .ph-faq-item:last-child { border-bottom: none; }
        .ph-step { display: flex; gap: 20px; align-items: flex-start; padding: 20px 0; border-bottom: 1px solid #f1f5f9; }
        .ph-step:last-child { border-bottom: none; }
        .ph-step-num { width: 44px; height: 44px; border-radius: 50%; background: #0a1628; color: #fff; font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ph-sticky-cta { display: none; }
        @media (max-width: 768px) {
          .ph-hero-grid { grid-template-columns: 1fr !important; }
          .ph-req-grid { grid-template-columns: 1fr !important; }
          .ph-trust-grid { grid-template-columns: 1fr !important; }
          .ph-sticky-cta { display: flex; position: fixed; bottom: 0; left: 0; right: 0; padding: 14px 20px; background: rgba(10,22,40,0.97); backdrop-filter: blur(8px); border-top: 1px solid rgba(255,255,255,0.1); z-index: 90; gap: 10px; }
          .ph-sticky-cta a, .ph-sticky-cta button { flex: 1; text-align: center; justify-content: center; font-size: 13px; padding: 12px 16px; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background: '#0a1628', padding: '72px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(13,148,136,0.08) 0%,transparent 70%)' }} />

        <div className="ph-container" style={{ position: 'relative' }}>
          <div className="ph-serif" style={{ display: 'inline-block', fontSize: 11, fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase', color: '#64748b', marginBottom: 20 }}>
            SelectiveCrew · Photographer Recruitment
          </div>

          <div className="ph-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 56, alignItems: 'center' }}>
            <div>
              <h1 className="ph-serif" style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#f8f4ec', lineHeight: 1.15, marginBottom: 20 }}>
                Cruise Ship Photographer Jobs<br />
                <span style={{ color: '#0d9488' }}>for Latin American Candidates</span>
              </h1>
              <p style={{ fontSize: 16, color: 'rgba(248,244,236,0.65)', lineHeight: 1.8, marginBottom: 32, maxWidth: 540 }}>
                A guest-facing photography role onboard Norwegian Cruise Line ships. You will photograph guests, direct portraits, cover events, and sell photo products in the onboard gallery. This role requires people skills, portfolio evidence, and intermediate to advanced English.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
                <a href="#apply" className="ph-btn-primary" style={{ background: '#0d9488' }}>Apply as Photographer</a>
                <a href="#requirements" className="ph-btn-outline" style={{ color: '#f8f4ec', borderColor: 'rgba(248,244,236,0.25)' }}>See Requirements</a>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px 24px' }}>
                {[
                  ['Portfolio-based application', 'We review your work before anything else'],
                  ['Guest-facing role', 'You direct, photograph, and sell to guests daily'],
                  ['English required', 'Intermediate to advanced — non-negotiable'],
                  ['Passport & travel readiness', 'Valid international passport required'],
                ].map(([title, sub]) => (
                  <div key={title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d9488', flexShrink: 0, marginTop: 7 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f8f4ec' }}>{title}</div>
                      <div style={{ fontSize: 12, color: 'rgba(248,244,236,0.45)', lineHeight: 1.5 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right card */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '28px 24px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#0d9488', textTransform: 'uppercase', marginBottom: 16 }}>Open Role</div>
              <div style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#f8f4ec', marginBottom: 6 }}>Cruise Ship Photographer</div>
              <div style={{ fontSize: 13, color: 'rgba(248,244,236,0.5)', marginBottom: 20 }}>Norwegian Cruise Line · Worldwide Fleet</div>

              {[
                ['Contract', '4–6 months onboard'],
                ['Base salary', '$900–$1,400 / month'],
                ['Extra', 'Meals, cabin & flights included'],
                ['Department', 'Photography / Onboard Retail'],
                ['Start dates', 'Rolling — based on vacancy'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 13 }}>
                  <span style={{ color: 'rgba(248,244,236,0.45)' }}>{k}</span>
                  <span style={{ color: '#f8f4ec', fontWeight: 500 }}>{v}</span>
                </div>
              ))}

              <div style={{ marginTop: 20, background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 12, color: '#5eead4', lineHeight: 1.6 }}>
                  <strong style={{ display: 'block', marginBottom: 4 }}>Free to apply.</strong>
                  Selective Crew never charges candidates. Voluntarily aligned with MLC 2006 standards.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT PHOTOGRAPHERS ACTUALLY DO ── */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div className="ph-container">
          <span className="ph-tag" style={{ marginBottom: 12, display: 'inline-block' }}>Role Reality</span>
          <h2 className="ph-serif" style={{ fontSize: 'clamp(22px,3vw,32px)', color: '#0a1628', marginBottom: 12 }}>What cruise ship photographers actually do</h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 36, maxWidth: 620, lineHeight: 1.7 }}>
            This is not a travel photography role. It is a structured, guest-facing position that combines photography skill with customer service and sales responsibility.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {[
              { icon: '📸', title: 'Guest portrait photography', desc: 'Photograph guests at embarkation, formal nights, dinner events, and themed occasions. Multiple daily sessions in different locations onboard.' },
              { icon: '🎭', title: 'Directing poses in English', desc: 'Guide guests into flattering poses, manage group shots, and communicate clearly in English with international passengers.' },
              { icon: '🎉', title: 'Event and activity coverage', desc: 'Cover onboard events, shore excursions, and special occasions. Work fast in dynamic, unpredictable environments.' },
              { icon: '🖼️', title: 'Gallery sales', desc: 'Present and sell printed and digital photo products in the onboard photo gallery. Sales performance is part of your role evaluation.' },
              { icon: '⚡', title: 'Fast-paced service environment', desc: 'High volume. Multiple guests. Tight schedules. You will work long days in a demanding but rewarding onboard environment.' },
              { icon: '🤝', title: 'Team collaboration', desc: 'Work within the photography and onboard retail department alongside a small international team.' },
            ].map(item => (
              <div key={item.title} className="ph-card" style={{ borderLeft: '3px solid #0d9488' }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0a1628', marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REQUIREMENTS ── */}
      <section id="requirements" style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div className="ph-container">
          <span className="ph-tag" style={{ marginBottom: 12, display: 'inline-block' }}>Eligibility</span>
          <h2 className="ph-serif" style={{ fontSize: 'clamp(22px,3vw,32px)', color: '#0a1628', marginBottom: 36 }}>Minimum Requirements</h2>

          <div className="ph-req-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Required */}
            <div className="ph-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0a1628' }} />
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#0a1628' }}>Required</div>
              </div>
              {[
                'Photography experience or relevant formal training',
                'Portrait, event, or people photography in your portfolio',
                'Intermediate to advanced English — spoken and written',
                'Confidence working with guests in a service environment',
                'Valid passport and international travel readiness',
                'Ability to commit to a 4–6 month onboard contract',
              ].map(item => (
                <div key={item} className="ph-check">
                  <div className="ph-check-icon" style={{ background: '#f0fdf9', border: '1px solid #0d9488' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Preferred */}
            <div className="ph-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#64748b' }} />
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#64748b' }}>Preferred — strengthens your application</div>
              </div>
              {[
                'Sales or retail experience — highly valued for gallery role',
                'Photo editing skills (Lightroom, Photoshop, or equivalent)',
                'Online portfolio on Behance, Instagram, or personal site',
                'Hospitality, resort, studio, or cruise ship experience',
                'Experience with high-volume event or wedding photography',
                'Second language beyond Spanish (French, Portuguese, Italian)',
              ].map(item => (
                <div key={item} className="ph-check">
                  <div className="ph-check-icon" style={{ background: '#f8fafc', border: '1px solid #cbd5e1' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority notice */}
          <div style={{ marginTop: 20, background: '#fff', border: '1px solid #e2e8f0', borderLeft: '4px solid #f0a500', borderRadius: '0 12px 12px 0', padding: '16px 20px', display: 'flex', gap: 14 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>⭐</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0a1628', marginBottom: 4 }}>High-priority candidates</div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                Candidates who combine photography experience with sales or retail background are prioritized. Cruise photographer roles include gallery sales responsibility — if you have both skills, say so clearly in your application.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div className="ph-container">
          <span className="ph-tag" style={{ marginBottom: 12, display: 'inline-block' }}>Portfolio</span>
          <h2 className="ph-serif" style={{ fontSize: 'clamp(22px,3vw,32px)', color: '#0a1628', marginBottom: 12 }}>What to include in your portfolio</h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 36, maxWidth: 580, lineHeight: 1.7 }}>
            Your portfolio is the first thing we review. A strong portfolio with consistent portrait and people photography moves your application forward — even without cruise experience.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20, marginBottom: 32 }}>
            {[
              { title: 'Volume', desc: '10–20 strong, curated images minimum. Many cruise photo applications request 20–30 samples.' },
              { title: 'Portrait examples', desc: 'Individual and group portraits showing pose direction, lighting control, and flattering composition.' },
              { title: 'People & event coverage', desc: 'Candid people photography, event coverage, or any high-volume people-photography setting.' },
              { title: 'Consistency', desc: 'Consistent lighting, exposure, and post-processing across the set. Variety of settings is good — inconsistency is not.' },
            ].map(item => (
              <div key={item.title} className="ph-card">
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0a1628', marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Portfolio checklist */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0a1628', marginBottom: 16 }}>Portfolio readiness checklist</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 10 }}>
              {[
                { key: 'portraits', label: 'I have portrait examples in my portfolio' },
                { key: 'events', label: 'I have event or people photography samples' },
                { key: 'lighting', label: 'My images show consistent lighting and composition' },
                { key: 'online', label: 'My portfolio is accessible online (link or PDF)' },
              ].map(item => (
                <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', background: portfolioCheck[item.key] ? '#f0fdf9' : '#fff', border: `1px solid ${portfolioCheck[item.key] ? '#0d9488' : '#e2e8f0'}`, borderRadius: 8, transition: 'all 0.2s' }}>
                  <input type="checkbox" checked={portfolioCheck[item.key]}
                    onChange={() => setPortfolioCheck(p => ({ ...p, [item.key]: !p[item.key] }))}
                    style={{ accentColor: '#0d9488', width: 16, height: 16 }} />
                  <span style={{ fontSize: 13, color: '#334155', lineHeight: 1.4 }}>{item.label}</span>
                </label>
              ))}
            </div>
            {Object.values(portfolioCheck).every(Boolean) && (
              <div style={{ marginTop: 16, background: '#0d9488', color: '#fff', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>
                ✓ Your portfolio sounds ready. Proceed to the application below.
              </div>
            )}
            <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
              Accepted formats: Instagram profile, Behance, personal website, Google Drive folder, or PDF.
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div className="ph-container" style={{ maxWidth: 680 }}>
          <span className="ph-tag" style={{ marginBottom: 12, display: 'inline-block' }}>Process</span>
          <h2 className="ph-serif" style={{ fontSize: 'clamp(22px,3vw,32px)', color: '#0a1628', marginBottom: 8 }}>How the application works</h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 36, lineHeight: 1.7 }}>
            Transparent, straightforward, and free at every step.
          </p>
          <div className="ph-card">
            {STEPS.map(s => (
              <div key={s.n} className="ph-step">
                <div className="ph-step-num">{s.n}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0a1628', marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* TESTIMONIALS */}
      <section style={{ padding:'72px 24px', background:'#f8fafc' }}>
        <div className="ph-container">
          <span className="ph-tag" style={{ marginBottom: 12, display: 'inline-block', background: '#fff' }}>Real Results</span>
          <h2 className="ph-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#0a1628', marginBottom:8 }}>Real people. Real results.</h2>
          <p style={{ fontSize:15, color:'#64748b', marginBottom:36, lineHeight:1.7 }}>Join 2,000+ candidates already working at sea.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
            {[
              { name:'Ruben De Jesus Hernandez', role:'Sales Associate', company:'Starboard Cruise Services', country:'Colombia 🇨🇴', quote:'The agency is very professional and the staff is very friendly. Placed within 3 weeks.' },
              { name:'Shalom Coba', role:'Sales Associate', company:'Harding Retail', country:'Colombia 🇨🇴', quote:'Selective Crew helped me get a job on a cruise ship and now I am traveling the world. Placed within a month.' },
              { name:'Evelin Hidalgo', role:'Retail Supervisor', company:'Starboard Cruise Services', country:'Colombia 🇨🇴', quote:'Went from applicant to Retail Supervisor within her first year.' },
            ].map(t => (
              <div key={t.name} className="ph-card" style={{ borderLeft:'3px solid #0d9488' }}>
                <div style={{ display:'flex', gap:2, marginBottom:12 }}>
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color:'#0d9488', fontSize:14 }}>★</span>)}
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
      {/* ── APPLICATION FORM ── */}
      <section id="apply" style={{ padding: '72px 24px', background: '#0a1628' }}>
        <div className="ph-container" style={{ maxWidth: 680 }}>
          <span className="ph-tag" style={{ marginBottom: 12, display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>Apply Now</span>
          <h2 className="ph-serif" style={{ fontSize: 'clamp(22px,3vw,32px)', color: '#f8f4ec', marginBottom: 8 }}>Photographer application</h2>
          <p style={{ fontSize: 15, color: 'rgba(248,244,236,0.55)', marginBottom: 32, lineHeight: 1.7 }}>
            Takes under 5 minutes. No documents needed in this step — just your profile and portfolio link.
          </p>

          {submitted ? (
            <div style={{ background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
              {getRoute() === 'priority' && <>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⭐</div>
                <div style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', color: '#f8f4ec', marginBottom: 10 }}>Strong application received</div>
                <p style={{ fontSize: 14, color: 'rgba(248,244,236,0.65)', lineHeight: 1.7 }}>Your profile and experience combination is competitive. Our recruiter will review your portfolio and contact you within 3–5 business days via WhatsApp or email.</p>
              </>}
              {getRoute() === 'apply' && <>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
                <div style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', color: '#f8f4ec', marginBottom: 10 }}>Application received</div>
                <p style={{ fontSize: 14, color: 'rgba(248,244,236,0.65)', lineHeight: 1.7 }}>We will review your portfolio and profile within 3–5 business days and contact you to discuss next steps.</p>
              </>}
              {getRoute() === 'pool' && <>
                <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
                <div style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', color: '#f8f4ec', marginBottom: 10 }}>Added to talent pool</div>
                <p style={{ fontSize: 14, color: 'rgba(248,244,236,0.65)', lineHeight: 1.7 }}>Your portfolio looks promising. We recommend strengthening your English level — when you are ready, we will prioritize your application for upcoming openings.</p>
              </>}
              {getRoute() === 'prep' && <>
                <div style={{ fontSize: 40, marginBottom: 16 }}>💡</div>
                <div style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', color: '#f8f4ec', marginBottom: 10 }}>A few things to prepare first</div>
                <p style={{ fontSize: 14, color: 'rgba(248,244,236,0.65)', lineHeight: 1.7 }}>To be competitive, you will need a portfolio with portrait examples and at least some photography experience. We have saved your profile and will reach out with guidance on how to prepare.</p>
              </>}
            </div>
          ) : (
            <form onSubmit={submit} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px' }}>

              {/* Step indicator */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
                {[1, 2].map(s => (
                  <div key={s} style={{ flex: 1, height: 4, borderRadius: 4, background: step >= s ? '#0d9488' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(248,244,236,0.4)', marginBottom: 20, letterSpacing: 1 }}>
                STEP {step} OF 2 — {step === 1 ? 'YOUR PROFILE' : 'YOUR EXPERIENCE'}
              </div>

              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>Full name *</label>
                      <input name="name" value={form.name} onChange={handle} required style={inp} placeholder="Your full name" />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>Country *</label>
                      <select name="country" value={form.country} onChange={handle} required style={sel}>
                        <option value="">Select country</option>
                        {['Colombia', 'Peru', 'Ecuador', 'Chile', 'Argentina', 'Mexico', 'Panama', 'Costa Rica', 'Dominican Republic', 'Venezuela', 'Uruguay', 'Other'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>WhatsApp *</label>
                      <input name="whatsapp" value={form.whatsapp} onChange={handle} required style={inp} placeholder="+57 300 000 0000" />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handle} required style={inp} placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>English level *</label>
                    <select name="english" value={form.english} onChange={handle} required style={sel}>
                      <option value="">Select level</option>
                      <option>Basic — I understand simple phrases</option>
                      <option>Intermediate — I can communicate with guests</option>
                      <option>Advanced — I am confident in English</option>
                      <option>Native / Fluent</option>
                    </select>
                  </div>
                  <button type="button" onClick={() => { if (form.name && form.country && form.whatsapp && form.email && form.english) setStep(2); }}
                    className="ph-btn-primary" style={{ background: '#0d9488', width: '100%', justifyContent: 'center', marginTop: 4 }}>
                    Continue to Step 2 →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>Years of photography experience *</label>
                      <select name="years" value={form.years} onChange={handle} required style={sel}>
                        <option value="">Select</option>
                        <option value="0">Less than 1 year</option>
                        <option value="1">1–2 years</option>
                        <option value="3">3–5 years</option>
                        <option value="5">5+ years</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>Type of photography *</label>
                      <select name="type" value={form.type} onChange={handle} required style={sel}>
                        <option value="">Select main type</option>
                        <option>Portrait / Studio</option>
                        <option>Events / Weddings</option>
                        <option>Tourism / Travel</option>
                        <option>Commercial / Advertising</option>
                        <option>Photojournalism / Documentary</option>
                        <option>Other people photography</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>Portfolio link *</label>
                    <input name="portfolio" value={form.portfolio} onChange={handle} required style={inp} placeholder="Instagram, Behance, website, Drive, or PDF URL" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>Customer service or sales experience? *</label>
                    <select name="sales" value={form.sales} onChange={handle} required style={sel}>
                      <option value="">Select</option>
                      <option>Yes — retail, hospitality, or direct sales</option>
                      <option>Some — limited customer-facing experience</option>
                      <option>No — photography only</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(248,244,236,0.6)', display: 'block', marginBottom: 6 }}>Passport status *</label>
                    <select name="passport" value={form.passport} onChange={handle} required style={sel}>
                      <option value="">Select</option>
                      <option>Valid passport — ready to travel</option>
                      <option>Passport in process</option>
                      <option>No passport yet</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button type="button" onClick={() => setStep(1)} className="ph-btn-outline" style={{ color: 'rgba(248,244,236,0.6)', borderColor: 'rgba(248,244,236,0.15)', padding: '12px 20px' }}>← Back</button>
                    <button type="submit" disabled={busy} className="ph-btn-primary" style={{ background: '#0d9488', flex: 1, justifyContent: 'center' }}>
                      {busy ? 'Submitting...' : 'Submit Photographer Application →'}
                    </button>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 16, fontSize: 12, color: 'rgba(248,244,236,0.3)', textAlign: 'center' }}>
                Free to apply. No documents required in this step. We never share your data with third parties.
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div className="ph-container" style={{ maxWidth: 720 }}>
          <span className="ph-tag" style={{ marginBottom: 12, display: 'inline-block' }}>FAQ</span>
          <h2 className="ph-serif" style={{ fontSize: 'clamp(22px,3vw,32px)', color: '#0a1628', marginBottom: 36 }}>Common questions</h2>
          <div className="ph-card">
            {FAQS.map(faq => (
              <div key={faq.q} className="ph-faq-item">
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0a1628', marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY SELECTIVE CREW ── */}
      <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div className="ph-container">
          <span className="ph-tag" style={{ marginBottom: 12, display: 'inline-block' }}>Why us</span>
          <h2 className="ph-serif" style={{ fontSize: 'clamp(22px,3vw,32px)', color: '#0a1628', marginBottom: 36 }}>Why apply through Selective Crew</h2>
          <div className="ph-trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
            {[
              { icon: '🎯', title: 'Portfolio-first screening', desc: 'We review your work before anything else. No generic form processing — a real recruiter evaluates your photography.' },
              { icon: '🌎', title: 'Latin America focused', desc: 'We specialize in Latin American candidates. We understand the markets, the languages, and the process.' },
              { icon: '📋', title: 'Role-realistic preparation', desc: 'We make sure you understand what the role involves before you apply — no surprises after embarkation.' },
              { icon: '🆓', title: 'Always free for candidates', desc: 'Selective Crew never charges candidates at any step. Voluntarily aligned with MLC 2006 standards.' },
            ].map(item => (
              <div key={item.title} className="ph-card">
                <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0a1628', marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Internal links for SEO */}
          <div style={{ marginTop: 32, padding: '20px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Related guides</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                ['How to become a cruise ship photographer', '/blog'],
                ['Cruise ship photographer interview guide', '/blog'],
                ['Cruise job requirements for Latin Americans', '/blog'],
                ['All open cruise ship positions', '/jobs'],
              ].map(([label, href]) => (
                <Link key={label} href={href} style={{ fontSize: 13, color: '#0d9488', textDecoration: 'none', fontWeight: 500, padding: '6px 14px', background: '#f0fdf9', border: '1px solid #ccfbf1', borderRadius: 100 }}>
                  {label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '72px 24px', background: '#0a1628', textAlign: 'center' }}>
        <div className="ph-container" style={{ maxWidth: 600 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 22 }}>📸</div>
          <h2 className="ph-serif" style={{ fontSize: 'clamp(22px,3.5vw,36px)', color: '#f8f4ec', marginBottom: 12 }}>
            Ready to apply as a cruise ship photographer?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(248,244,236,0.55)', lineHeight: 1.8, marginBottom: 32 }}>
            Free to apply. Portfolio-first review. Our recruiter responds within 3–5 business days.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#apply" className="ph-btn-primary" style={{ background: '#0d9488' }}>Start Photographer Application</a>
            <a href="#requirements" className="ph-btn-outline" style={{ color: 'rgba(248,244,236,0.7)', borderColor: 'rgba(248,244,236,0.2)' }}>Check Requirements First</a>
          </div>
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 20 }}>
            {['Portfolio-based review', 'Free to apply', 'Response in 3–5 days'].map(f => (
              <span key={f} style={{ fontSize: 12, color: 'rgba(248,244,236,0.35)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#0d9488' }}>✓</span> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOBILE STICKY CTA ── */}
      <div className="ph-sticky-cta">
        <a href="#apply" className="ph-btn-primary" style={{ background: '#0d9488' }}>Apply as Photographer</a>
        <a href="#requirements" className="ph-btn-outline" style={{ color: '#f8f4ec', borderColor: 'rgba(248,244,236,0.3)', background: 'transparent' }}>Requirements</a>
      </div>
    </>
  );
}
