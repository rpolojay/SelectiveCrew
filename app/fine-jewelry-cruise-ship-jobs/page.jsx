'use client';
import { useState } from 'react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: 'Fine Jewelry Specialist - Cruise Ship Jobs',
  description: 'Fine Jewelry Specialist role onboard cruise ships with Starboard Cruise Services. Sell luxury fine jewelry including diamonds, gold, and branded watches to international guests. Commission-based earnings with base salary included.',
  datePosted: '2026-04-01',
  validThrough: '2026-12-31',
  employmentType: 'CONTRACTOR',
  hiringOrganization: { '@type': 'Organization', name: 'Selective Crew', sameAs: 'https://selectivecrew.com' },
  jobLocation: { '@type': 'Place', name: 'Onboard — Starboard Cruise Services Fleet' },
  applicantLocationRequirements: { '@type': 'Country', name: 'Latin America' },
  baseSalary: { '@type': 'MonetaryAmount', currency: 'USD', value: { '@type': 'QuantitativeValue', minValue: 900, maxValue: 2000, unitText: 'MONTH' } },
  skills: 'Fine jewelry sales, luxury retail, diamond knowledge, guest interaction, English communication, upselling, commission sales',
};

const STEPS = [
  { n: '01', title: 'Submit your jewelry sales profile', desc: 'Name, country, WhatsApp, jewelry or luxury retail background — takes under 3 minutes.' },
  { n: '02', title: 'Share your sales experience', desc: 'Tell us about your jewelry or luxury category experience, sales targets, and guest interaction confidence.' },
  { n: '03', title: 'English and product knowledge screening', desc: 'We assess your English level and jewelry knowledge before moving forward.' },
  { n: '04', title: 'Match to current openings', desc: 'We match your profile to active Fine Jewelry Specialist openings with Starboard Cruise Services.' },
  { n: '05', title: 'Final interview and next steps', desc: 'Video interview with our team and Starboard. We guide you through every document and embarkation step.' },
];

const FAQS = [
  { q: 'Do I need jewelry experience specifically?', a: 'Jewelry or luxury retail experience is strongly preferred. Experience selling fine jewelry, watches, diamonds, or high-end accessories gives you a significant advantage. Candidates with luxury cosmetics or perfume backgrounds are also considered.' },
  { q: 'What jewelry products will I sell?', a: 'You will sell fine jewelry including diamond pieces, gold jewelry, branded watches, and gemstone collections to international cruise guests. Starboard carries leading luxury jewelry brands onboard.' },
  { q: 'How does commission work?', a: 'Fine Jewelry Specialists earn a base salary plus performance commissions. Because jewelry carries high price points, top performers can earn significantly above base salary. Your results directly determine your monthly income.' },
  { q: 'What English level is required?', a: 'Intermediate to advanced English is required. You will be presenting high-value jewelry to international guests, explaining product details, and building trust — all in English.' },
  { q: 'Is there training provided?', a: 'Yes. Starboard provides onboard product training. However, prior jewelry or luxury retail knowledge significantly accelerates your performance and earning potential from day one.' },
  { q: 'How long are contracts?', a: 'Standard contracts run 4 to 8 months onboard. Meals, accommodation, and flights to the ship are included. You will live and work onboard for the duration of your contract.' },
  { q: 'Can I apply from any Latin American country?', a: 'We recruit Fine Jewelry Specialists from Colombia, Peru, Ecuador, Chile, Argentina, Panama, Costa Rica, Dominican Republic, and Venezuela. A valid passport is required.' },
];

const navy = '#0a1628';
const gold = '#c9a84c';
const teal = '#0d9488';

export default function FineJewelryPage() {
  const [form, setForm] = useState({ name:'', country:'', whatsapp:'', email:'', jewelryExp:'', english:'', luxuryCategory:'', passport:'', availability:'' });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.whatsapp || !form.country) { setError('Please fill in all required fields.'); return; }
    setBusy(true);
    setError('');
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'careers@selectivecrew.com',
          subject: 'Fine Jewelry Specialist Application - ' + form.name + ' (' + form.country + ')',
          text: 'FINE JEWELRY SPECIALIST APPLICATION\n\nName: ' + form.name + '\nCountry: ' + form.country + '\nWhatsApp: ' + form.whatsapp + '\nEmail: ' + form.email + '\nJewelry Experience: ' + form.jewelryExp + '\nEnglish Level: ' + form.english + '\nLuxury Category: ' + form.luxuryCategory + '\nPassport: ' + form.passport + '\nAvailability: ' + form.availability + '\n\nSource: selectivecrew.com/fine-jewelry-cruise-ship-jobs',
        }),
      });
      await addDoc(collection(db, 'applications'), {
        fullName: form.name, email: form.email, whatsapp: form.whatsapp, country: form.country,
        role: 'Fine Jewelry Specialist — Starboard Cruise Services',
        position: 'Fine Jewelry Specialist — Starboard Cruise Services',
        experience: form.jewelryExp, english: form.english,
        passport: form.passport, availability: form.availability,
        video1: '', video2: '', video3: '', cv: '',
        status: 'new', createdAt: serverTimestamp(),
        source: 'fine-jewelry-page',
        notes: 'Luxury category: ' + form.luxuryCategory,
      });
      setSubmitted(true);
    } catch(err) {
      setError('Something went wrong. Please contact us on WhatsApp: +57 318 847 4058');
    }
    setBusy(false);
  }

  const inp = { width:'100%', padding:'11px 14px', border:'1.5px solid #d1d9e6', borderRadius:8, fontSize:14, fontFamily:'inherit', color:navy, background:'#f8fafc', boxSizing:'border-box', outline:'none' };
  const sel = { ...inp, appearance:'none', cursor:'pointer' };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .fj-container { max-width: 960px; margin: 0 auto; padding: 0 24px; }
        .fj-serif { font-family: 'Playfair Display', Georgia, serif; }
        .fj-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; }
        .fj-btn-gold { display: inline-flex; align-items: center; gap: 8px; background: #c9a84c; color: #0a1628; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; font-family: inherit; text-decoration: none; border: none; cursor: pointer; transition: background 0.2s; }
        .fj-btn-gold:hover { background: #b8943d; }
        .fj-btn-outline { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: #f8f4ec; padding: 13px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; font-family: inherit; text-decoration: none; border: 1.5px solid rgba(248,244,236,0.25); cursor: pointer; }
        .fj-step { display: flex; gap: 20px; align-items: flex-start; padding: 20px 0; border-bottom: 1px solid #f1f5f9; }
        .fj-step:last-child { border-bottom: none; }
        .fj-step-num { width: 44px; height: 44px; border-radius: 50%; background: #c9a84c; color: #0a1628; font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .fj-faq-item { border-bottom: 1px solid #f1f5f9; padding: 20px 0; }
        .fj-faq-item:last-child { border-bottom: none; }
        @media (max-width: 768px) {
          .fj-hero-grid { grid-template-columns: 1fr !important; }
          .fj-roles-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={{ background:'linear-gradient(160deg,#0a1628 0%,#1a2a1a 60%,#0a1628 100%)', padding:'72px 24px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
        <div style={{ position:'absolute', top:'10%', right:'-5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(201,168,76,0.1) 0%,transparent 70%)' }} />
        <div className="fj-container" style={{ position:'relative' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(201,168,76,0.15)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:100, padding:'5px 14px', marginBottom:20 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:gold }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#fcd34d', letterSpacing:1.5 }}>FINE JEWELRY · STARBOARD CRUISE SERVICES · NOW HIRING</span>
          </div>
          <div className="fj-hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:56, alignItems:'center' }}>
            <div>
              <h1 className="fj-serif" style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:700, color:'#f8f4ec', lineHeight:1.15, marginBottom:20 }}>
                Fine Jewelry Specialist<br /><span style={{ color:gold }}>Cruise Ship Jobs</span><br />
                <span style={{ fontSize:'55%', color:'rgba(248,244,236,0.55)', fontStyle:'italic' }}>Luxury Jewelry Sales · Latin America</span>
              </h1>
              <p style={{ fontSize:16, color:'rgba(248,244,236,0.65)', lineHeight:1.8, marginBottom:32, maxWidth:540 }}>
                Sell diamonds, gold jewelry, and luxury watches to international guests aboard Starboard Cruise Services ships. High commission potential, world travel, and a direct path to senior jewelry roles — all included.
              </p>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:36 }}>
                <a href="#apply" className="fj-btn-gold">Apply for Jewelry Role</a>
                <a href="#requirements" className="fj-btn-outline">See Requirements</a>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px 24px' }}>
                {[
                  ['Diamonds & fine jewelry','Sell premium pieces to international guests'],
                  ['High commission potential','Jewelry price points = significant earnings'],
                  ['Intermediate English required','Guest-facing role in English daily'],
                  ['Luxury retail background valued','Jewelry, watches, cosmetics preferred'],
                ].map(([title,sub]) => (
                  <div key={title} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:gold, flexShrink:0, marginTop:7 }} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#f8f4ec' }}>{title}</div>
                      <div style={{ fontSize:12, color:'rgba(248,244,236,0.45)', lineHeight:1.5 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Details Card */}
            <div style={{ background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.25)', borderRadius:20, padding:'28px 24px' }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:gold, textTransform:'uppercase', marginBottom:16 }}>Role Details</div>
              <div style={{ fontSize:20, fontFamily:'Playfair Display,serif', fontWeight:600, color:'#f8f4ec', marginBottom:6 }}>Fine Jewelry Specialist</div>
              <div style={{ fontSize:13, color:'rgba(248,244,236,0.5)', marginBottom:20 }}>Starboard Cruise Services · Worldwide</div>
              {[
                ['Contract','4-8 months onboard'],
                ['Base salary','$900/mo + commissions'],
                ['Commission','Performance-based — high earner potential'],
                ['Products','Diamonds, gold, branded watches'],
                ['Extras','Meals, cabin & flights included'],
                ['Partner','Starboard Cruise Services since 2010'],
              ].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:13 }}>
                  <span style={{ color:'rgba(248,244,236,0.45)' }}>{k}</span>
                  <span style={{ color:'#f8f4ec', fontWeight:500, textAlign:'right', maxWidth:180 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop:20, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:10, padding:'12px 14px' }}>
                <div style={{ fontSize:12, color:'#fcd34d', lineHeight:1.6 }}>
                  <strong style={{ display:'block', marginBottom:4 }}>High commission role.</strong>
                  Fine jewelry price points mean top performers earn well above base salary.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU WILL SELL */}
      <section style={{ padding:'72px 24px', background:'#fff' }}>
        <div className="fj-container">
          <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#64748b', background:'#f1f5f9', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Products</span>
          <h2 className="fj-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:navy, marginBottom:12 }}>What you will sell onboard</h2>
          <p style={{ fontSize:15, color:'#64748b', marginBottom:36, maxWidth:620, lineHeight:1.7 }}>Starboard operates luxury fine jewelry boutiques aboard major cruise lines. As a Fine Jewelry Specialist, you represent premium brands to high-net-worth international guests.</p>
          <div className="fj-roles-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
            {[
              { icon:'💎', title:'Diamond Jewelry', desc:'Engagement rings, diamond pendants, and fine diamond pieces from leading jewelry brands. High value, high commission.' },
              { icon:'⌚', title:'Luxury Watches', desc:'Branded timepieces from premium watch houses. Prior watch knowledge or luxury retail experience is a major advantage.' },
              { icon:'🥇', title:'Gold Jewelry', desc:'14K and 18K gold collections including necklaces, bracelets, earrings, and rings across multiple price points.' },
              { icon:'💍', title:'Gemstone Pieces', desc:'Colored gemstone jewelry including tanzanite, sapphire, emerald, and other precious and semi-precious stone collections.' },
              { icon:'🎁', title:'Branded Accessories', desc:'Premium branded jewelry accessories and gift collections targeted at cruise guests looking for meaningful purchases.' },
              { icon:'🛳️', title:'Port & Destination Jewelry', desc:'Exclusive onboard collections tied to destinations — popular with guests looking for unique souvenirs at premium price points.' },
            ].map(item => (
              <div key={item.title} className="fj-card" style={{ borderLeft:'3px solid '+gold }}>
                <div style={{ fontSize:26, marginBottom:10 }}>{item.icon}</div>
                <div style={{ fontSize:14, fontWeight:700, color:navy, marginBottom:6 }}>{item.title}</div>
                <div style={{ fontSize:13, color:'#64748b', lineHeight:1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section id="requirements" style={{ padding:'72px 24px', background:'#f8fafc' }}>
        <div className="fj-container">
          <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#64748b', background:'#f1f5f9', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Eligibility</span>
          <h2 className="fj-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:navy, marginBottom:36 }}>Minimum Requirements</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
            <div className="fj-card">
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:navy, marginBottom:20 }}>Required</div>
              {[
                'Minimum 1 year retail or sales experience',
                'Intermediate to advanced English',
                'Guest-facing confidence and presentation',
                'Valid passport and travel readiness',
                'Ability to commit to 4-8 month contract',
                'Commission-driven sales mindset',
              ].map(item => (
                <div key={item} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'#fef9ec', border:'1px solid '+gold, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize:14, color:'#334155', lineHeight:1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="fj-card">
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#64748b', marginBottom:20 }}>Preferred — strengthens your application</div>
              {[
                'Fine jewelry or watch retail experience',
                'Diamond or gemstone product knowledge',
                'Luxury brand retail background',
                'Previous cruise ship experience',
                'Advanced English or additional language',
                'Experience with high-value transactions',
              ].map(item => (
                <div key={item} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10 }}>
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

      {/* PROCESS */}
      <section style={{ padding:'72px 24px', background:'#fff' }}>
        <div className="fj-container" style={{ maxWidth:680 }}>
          <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#64748b', background:'#f1f5f9', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Process</span>
          <h2 className="fj-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:navy, marginBottom:8 }}>How the application works</h2>
          <p style={{ fontSize:15, color:'#64748b', marginBottom:36, lineHeight:1.7 }}>Transparent, free, and straightforward at every step.</p>
          <div className="fj-card">
            {STEPS.map(s => (
              <div key={s.n} className="fj-step">
                <div className="fj-step-num">{s.n}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:navy, marginBottom:4 }}>{s.title}</div>
                  <div style={{ fontSize:13, color:'#64748b', lineHeight:1.65 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLY FORM */}
      <section id="apply" style={{ padding:'72px 24px', background:'#0a1628' }}>
        <div className="fj-container" style={{ maxWidth:680 }}>
          <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Apply Now</span>
          <h2 className="fj-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#f8f4ec', marginBottom:8 }}>Fine Jewelry Specialist Application</h2>
          <p style={{ fontSize:15, color:'rgba(248,244,236,0.55)', marginBottom:32, lineHeight:1.7 }}>Takes under 4 minutes. No documents needed at this stage. 100% free.</p>

          {submitted ? (
            <div style={{ background:'rgba(201,168,76,0.12)', border:'1px solid rgba(201,168,76,0.25)', borderRadius:16, padding:'40px 32px', textAlign:'center' }}>
              <div style={{ fontSize:40, marginBottom:16 }}>💎</div>
              <div style={{ fontSize:20, fontFamily:"'Playfair Display',serif", color:'#f8f4ec', marginBottom:10 }}>Application Received</div>
              <p style={{ fontSize:14, color:'rgba(248,244,236,0.65)', lineHeight:1.7 }}>Thank you for applying for the Fine Jewelry Specialist role. Our recruiter will review your profile within 3-5 business days and contact you via WhatsApp.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'32px 28px' }}>
              {error && <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'12px 14px', marginBottom:16, fontSize:13, color:'#fca5a5' }}>{error}</div>}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Full name *</label>
                  <input name="name" value={form.name} onChange={handle} required style={inp} placeholder="Your full name" />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Country *</label>
                  <select name="country" value={form.country} onChange={handle} required style={sel}>
                    <option value="">Select country</option>
                    {['Colombia','Peru','Ecuador','Chile','Argentina','Panama','Costa Rica','Dominican Republic','Venezuela','Uruguay'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>WhatsApp *</label>
                  <input name="whatsapp" value={form.whatsapp} onChange={handle} required style={inp} placeholder="+57 300 000 0000" />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handle} required style={inp} placeholder="your@email.com" />
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Jewelry or luxury retail experience *</label>
                <select name="jewelryExp" value={form.jewelryExp} onChange={handle} required style={sel}>
                  <option value="">Select</option>
                  <option>Fine jewelry retail (1+ years)</option>
                  <option>Watch or luxury accessories retail</option>
                  <option>Luxury cosmetics or perfume retail</option>
                  <option>General retail with some luxury exposure</option>
                  <option>No jewelry experience but strong sales background</option>
                </select>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Luxury category experience</label>
                <select name="luxuryCategory" value={form.luxuryCategory} onChange={handle} style={sel}>
                  <option value="">Select main category</option>
                  <option>Fine Jewelry (diamonds, gold, gemstones)</option>
                  <option>Luxury Watches</option>
                  <option>Luxury Cosmetics / Perfume</option>
                  <option>Fashion / Accessories</option>
                  <option>Mixed luxury retail</option>
                  <option>Other retail</option>
                </select>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>English level *</label>
                <select name="english" value={form.english} onChange={handle} required style={sel}>
                  <option value="">Select level</option>
                  <option>Basic — simple phrases only</option>
                  <option>Intermediate — can communicate with guests</option>
                  <option>Advanced — fully confident</option>
                  <option>Native / Fluent</option>
                </select>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Passport status *</label>
                  <select name="passport" value={form.passport} onChange={handle} required style={sel}>
                    <option value="">Select</option>
                    <option>Valid passport — ready to travel</option>
                    <option>Passport in process</option>
                    <option>No passport yet</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Availability *</label>
                  <select name="availability" value={form.availability} onChange={handle} required style={sel}>
                    <option value="">Select</option>
                    <option>Immediately available</option>
                    <option>Available in 1-2 months</option>
                    <option>Available in 3-6 months</option>
                    <option>Just exploring options</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={busy} className="fj-btn-gold" style={{ width:'100%', justifyContent:'center' }}>
                {busy ? 'Submitting...' : 'Submit Jewelry Application ->'}
              </button>
              <div style={{ marginTop:16, fontSize:12, color:'rgba(248,244,236,0.3)', textAlign:'center' }}>Free to apply. No documents required. We never share your data.</div>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:'72px 24px', background:'#fff' }}>
        <div className="fj-container" style={{ maxWidth:720 }}>
          <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#64748b', background:'#f1f5f9', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>FAQ</span>
          <h2 className="fj-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:navy, marginBottom:36 }}>Common questions</h2>
          <div className="fj-card">
            {FAQS.map(faq => (
              <div key={faq.q} className="fj-faq-item">
                <div style={{ fontSize:15, fontWeight:700, color:navy, marginBottom:8 }}>{faq.q}</div>
                <div style={{ fontSize:14, color:'#64748b', lineHeight:1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding:'72px 24px', background:'#0a1628', textAlign:'center' }}>
        <div className="fj-container" style={{ maxWidth:600 }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(201,168,76,0.15)', border:'1px solid rgba(201,168,76,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:22 }}>💎</div>
          <h2 className="fj-serif" style={{ fontSize:'clamp(22px,3.5vw,36px)', color:'#f8f4ec', marginBottom:12 }}>Ready to sell fine jewelry on a cruise ship?</h2>
          <p style={{ fontSize:15, color:'rgba(248,244,236,0.55)', lineHeight:1.8, marginBottom:32 }}>Free to apply. Our recruiter responds within 3-5 business days.</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="#apply" className="fj-btn-gold">Apply for Jewelry Role</a>
            <a href="#requirements" className="fj-btn-outline">Check Requirements</a>
          </div>
          <div style={{ marginTop:32, paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize:12, color:'rgba(248,244,236,0.3)', marginBottom:10 }}>Also hiring</div>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/fast-track-manager" style={{ fontSize:13, color:'rgba(248,244,236,0.5)', textDecoration:'none', padding:'6px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:100 }}>👔 Fast Track Manager</Link>
              <Link href="/cruise-ship-photographer-jobs" style={{ fontSize:13, color:'rgba(248,244,236,0.5)', textDecoration:'none', padding:'6px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:100 }}>📸 Photographer Jobs</Link>
              <Link href="/apply" style={{ fontSize:13, color:'rgba(248,244,236,0.5)', textDecoration:'none', padding:'6px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:100 }}>🛍️ Sales Associate</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}