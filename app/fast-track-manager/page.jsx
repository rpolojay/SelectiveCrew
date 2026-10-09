'use client';
import { useState } from 'react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: 'Fast Track Assistant Retail Manager',
  description: 'Leadership role in onboard duty-free retail. Manage a team of 10+ sales associates, drive department revenue, deliver guest-facing service excellence on Starboard Cruise Services ships.',
  datePosted: '2026-04-01',
  validThrough: '2026-12-31',
  employmentType: 'CONTRACTOR',
  hiringOrganization: { '@type': 'Organization', name: 'Selective Crew', sameAs: 'https://selectivecrew.com' },
  jobLocation: { '@type': 'Place', name: 'Onboard — Starboard Cruise Services Fleet' },
  baseSalary: { '@type': 'MonetaryAmount', currency: 'USD', value: { '@type': 'QuantitativeValue', minValue: 1200, maxValue: 2000, unitText: 'MONTH' } },
};

const STEPS = [
  { n: '01', title: 'Submit your leadership profile', desc: 'Name, country, WhatsApp, team size managed — takes under 4 minutes.' },
  { n: '02', title: 'Leadership assessment', desc: 'Our recruiter reviews your management experience and English level before moving forward.' },
  { n: '03', title: 'Recruiter screening call', desc: 'Video call focused on your leadership style, sales results, and team management experience.' },
  { n: '04', title: 'Active vacancy or priority pool', desc: 'If a role is open you move to final interview. If not, you are first in line for upcoming openings.' },
  { n: '05', title: 'Final interview and next steps', desc: 'Interview with Starboard hiring team. We guide you through every document and embarkation step.' },
];

const FAQS = [
  { q: 'Do I need cruise ship experience to apply?', a: 'No. Strong land-based retail management experience is valued. What matters most is your track record leading a team of 10 or more people, hitting sales targets, and English ability.' },
  { q: 'What does Fast Track mean?', a: 'Fast Track means you enter directly into an Assistant Manager track — not starting as a sales associate. You begin with a 12-16 week training period at $1,500/mo base salary only. Once you successfully complete training and are formally promoted to ASM, your base adjusts to $1,200/mo but you also begin earning performance-based sales commissions. Your total monthly earnings as ASM will be significantly higher than during training.' },
  { q: 'What is the team size I will manage?', a: 'You will lead a team of 10 or more onboard retail sales associates. You are responsible for their daily performance, coaching, and results.' },
  { q: 'Is this a sales role as well as a management role?', a: 'Yes. You will set sales targets, coach your team to hit them, and be accountable for department revenue. Retail management experience with a sales culture is essential.' },
  { q: 'What English level is required?', a: 'Advanced English is required. You will communicate with international guests, lead team briefings in English, and report to senior management in English daily.' },
  { q: 'What is the salary structure?', a: 'During the 12-16 week training period you receive $1,500/mo base salary — no commission. Once you complete training and are promoted to Assistant Manager, your base adjusts to $1,200/mo as a beginner ASM, but you begin earning performance-based sales commissions on top. Your total monthly income as ASM will be substantially higher than during training.' },
  { q: 'What happens after I apply?', a: 'Our recruiter reviews your profile within 3 to 5 business days. If your experience matches, we schedule a screening call. We respond to every application regardless of outcome.' },
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

export default function FastTrackPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:'', country:'', whatsapp:'', email:'', english:'', teamSize:'', yearsManagement:'', sector:'', salesExperience:'', passport:'', availability:'' });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeB64, setResumeB64] = useState('');
  function handleResume(file) {
    if (!file) return;
    setResumeFile(file);
    const r = new FileReader();
    r.onload = () => setResumeB64(r.result.split(',')[1]);
    r.readAsDataURL(file);
  }
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getRoute = () => {
    const strongEnglish = ['Advanced — fully confident', 'Native / Fluent'].includes(form.english);
    const largeTeam = ['10-20 people', '20+ people'].includes(form.teamSize);
    const experienced = ['2-4 years', '5+ years'].includes(form.yearsManagement);
    if (strongEnglish && largeTeam && experienced) return 'priority';
    if (strongEnglish && experienced) return 'apply';
    if (experienced && !strongEnglish) return 'pool';
    return 'prep';
  };

  async function submit(e) {
    e.preventDefault();
    if (!resumeB64) { alert('Please upload your resume before submitting.'); return; }
    setBusy(true);
    const route = getRoute();
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'careers@selectivecrew.com',
          subject: 'Fast Track Manager Application - ' + form.name + ' (' + form.country + ') [' + route.toUpperCase() + ']',
          text: 'FAST TRACK MANAGER APPLICATION\n\nPriority: ' + route.toUpperCase()
            + '\n\nName: ' + form.name + '\nCountry: ' + form.country + '\nWhatsApp: ' + form.whatsapp
            + '\nEmail: ' + form.email + '\nEnglish Level: ' + form.english
            + '\nTeam Size Managed: ' + form.teamSize + '\nYears in Management: ' + form.yearsManagement
            + '\nRetail Sector: ' + form.sector + '\nSales Experience: ' + form.salesExperience
            + '\nPassport: ' + form.passport + '\nAvailability: ' + form.availability
            + '\n\nSource: selectivecrew.com/fast-track-manager',
          attachments: resumeB64 ? [{filename: resumeFile ? resumeFile.name : 'resume.pdf', content: resumeB64}] : []
        }),
      });
      const { score, grade } = scoreApplication(form);
      await addDoc(collection(db, 'fastTrackApplications'), { ...form, route, score, grade, source: 'fast-track-manager', submittedAt: serverTimestamp() });
      await addDoc(collection(db, 'applications'), { fullName: form.name, email: form.email, whatsapp: form.whatsapp, country: form.country, position: 'Fast Track Assistant Manager', status: 'new', score, grade, english: form.english, salesExp: form.salesExperience, passport: form.passport, availability: form.availability, source: 'fast-track-manager', createdAt: serverTimestamp() });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
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
        .ft-container { max-width: 960px; margin: 0 auto; padding: 0 24px; }
        .ft-serif { font-family: 'Playfair Display', Georgia, serif; }
        .ft-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; }
        .ft-btn-gold { display: inline-flex; align-items: center; gap: 8px; background: #c9a84c; color: #0a1628; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; font-family: inherit; text-decoration: none; border: none; cursor: pointer; transition: background 0.2s; }
        .ft-btn-gold:hover { background: #b8943d; }
        .ft-btn-outline { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: #f8f4ec; padding: 13px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; font-family: inherit; text-decoration: none; border: 1.5px solid rgba(248,244,236,0.25); cursor: pointer; }
        .ft-check { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
        .ft-faq-item { border-bottom: 1px solid #f1f5f9; padding: 20px 0; }
        .ft-faq-item:last-child { border-bottom: none; }
        .ft-step { display: flex; gap: 20px; align-items: flex-start; padding: 20px 0; border-bottom: 1px solid #f1f5f9; }
        .ft-step:last-child { border-bottom: none; }
        .ft-step-num { width: 44px; height: 44px; border-radius: 50%; background: #c9a84c; color: #0a1628; font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ft-sticky { display: none; }
        @media (max-width: 768px) {
          .ft-hero-grid { grid-template-columns: 1fr !important; }
          .ft-req-grid { grid-template-columns: 1fr !important; }
          .ft-role-grid { grid-template-columns: 1fr !important; }
          .ft-sticky { display: flex; position: fixed; bottom: 0; left: 0; right: 0; padding: 14px 20px; background: rgba(10,22,40,0.97); backdrop-filter: blur(8px); border-top: 1px solid rgba(255,255,255,0.1); z-index: 90; gap: 10px; }
          .ft-sticky a { flex: 1; text-align: center; justify-content: center; font-size: 13px; padding: 12px; }
        }
      `}</style>

      {/* HERO */}
      <section style={{ background:'linear-gradient(160deg,#0a1628 0%,#1a3a5c 60%,#0f2d4a 100%)', padding:'72px 24px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />
        <div style={{ position:'absolute', top:'10%', right:'-5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(201,168,76,0.08) 0%,transparent 70%)' }} />
        <div className="ft-container" style={{ position:'relative' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:100, padding:'5px 14px', marginBottom:20 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#ef4444' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#fca5a5', letterSpacing:1.5 }}>HOT ROLE · STARBOARD CRUISE SERVICES · HIRING YEAR-ROUND</span>
          </div>
          <div className="ft-hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:56, alignItems:'center' }}>
            <div>
              <h1 className="ft-serif" style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:700, color:'#f8f4ec', lineHeight:1.15, marginBottom:20 }}>
                Fast Track<br /><span style={{ color:'#c9a84c' }}>Assistant Manager</span><br />
                <span style={{ fontSize:'55%', color:'rgba(248,244,236,0.55)', fontStyle:'italic' }}>Cruise Ship Management Jobs · Latin America</span>
              </h1>
              <p style={{ fontSize:16, color:'rgba(248,244,236,0.65)', lineHeight:1.8, marginBottom:32, maxWidth:540 }}>
                A retail leadership position on Starboard Cruise Services ships. You begin with a 12-16 week training period at $1,500/mo base salary only — no commission during training. Once you successfully complete training and are promoted to the full Assistant Manager role, your base adjusts to $1,200/mo but you also earn performance-based sales commissions. Total monthly earnings as ASM are significantly higher than during training. This role is for proven retail managers — not entry-level applicants.
              </p>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:36 }}>
                <a href="#apply" className="ft-btn-gold">Apply as Manager</a>
                <a href="#requirements" className="ft-btn-outline">See Requirements</a>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px 24px' }}>
                {[
                  ['Team of 10+ required','You must have managed a real retail team'],
                  ['Sales target accountability','You own department revenue performance'],
                  ['Advanced English required','Daily guest and team communication'],
                  ['Direct path to Retail Manager','Fastest promotion track in onboard retail'],
                ].map(([title,sub]) => (
                  <div key={title} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:'#c9a84c', flexShrink:0, marginTop:7 }} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#f8f4ec' }}>{title}</div>
                      <div style={{ fontSize:12, color:'rgba(248,244,236,0.45)', lineHeight:1.5 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'28px 24px' }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:'#c9a84c', textTransform:'uppercase', marginBottom:16 }}>Role Details</div>
              <div style={{ fontSize:20, fontFamily:'Playfair Display, serif', fontWeight:600, color:'#f8f4ec', marginBottom:6 }}>Fast Track Assistant Manager</div>
              <div style={{ fontSize:13, color:'rgba(248,244,236,0.5)', marginBottom:20 }}>Starboard Cruise Services · Worldwide</div>
              {[
                ['Contract','4-8 months onboard'],
                ['Base salary','$1,200-$2,000 / month'],
                ['Commission','Performance-based on top'],
                ['Team size','10+ retail associates'],
                ['Extras','Meals, cabin & flights included'],
                ['Promotion path','Retail Manager in 1-2 contracts'],
              ].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:13 }}>
                  <span style={{ color:'rgba(248,244,236,0.45)' }}>{k}</span>
                  <span style={{ color:'#f8f4ec', fontWeight:500, textAlign:'right', maxWidth:180 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop:20, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, padding:'12px 14px' }}>
                <div style={{ fontSize:12, color:'#fca5a5', lineHeight:1.6 }}>
                  <strong style={{ display:'block', marginBottom:4 }}>Hiring year-round.</strong>
                  Interviews ongoing for upcoming departures. Secure your spot on the next contract.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT THE ROLE IS */}
      <section style={{ padding:'72px 24px', background:'#fff' }}>
        <div className="ft-container">
          <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#64748b', background:'#f1f5f9', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Role Reality</span>
          <h2 className="ft-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#0a1628', marginBottom:12 }}>What this role actually involves</h2>
          <p style={{ fontSize:15, color:'#64748b', marginBottom:36, maxWidth:620, lineHeight:1.7 }}>This is a genuine retail management position with team accountability, revenue targets, and daily operational responsibility — not a senior sales associate with a title.</p>
          <div className="ft-role-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
            {[
              { icon:'👥', title:'Team leadership', desc:'Lead, coach, and develop a team of 10+ duty-free sales associates across multiple onboard locations.' },
              { icon:'📊', title:'Sales target ownership', desc:"You own your department's daily, weekly, and contract revenue targets. Performance is measured against numbers." },
              { icon:'🛍️', title:'Duty-free operations', desc:'Oversee inventory, product displays, opening/closing procedures, and stock management across the retail department.' },
              { icon:'🤝', title:'Guest-facing leadership', desc:'Handle escalated guest situations, lead by example on the floor, and maintain service standards across the team.' },
              { icon:'📋', title:'Reporting and admin', desc:'Daily sales reports, team scheduling, performance documentation, and communication with the Retail Manager.' },
              { icon:'🚀', title:'Promotion path', desc:'Fast Track moves strong performers to full Retail Manager within 1 to 2 contracts. Your results determine your pace.' },
            ].map(item => (
              <div key={item.title} className="ft-card" style={{ borderLeft:'3px solid #c9a84c' }}>
                <div style={{ fontSize:26, marginBottom:10 }}>{item.icon}</div>
                <div style={{ fontSize:14, fontWeight:700, color:'#0a1628', marginBottom:6 }}>{item.title}</div>
                <div style={{ fontSize:13, color:'#64748b', lineHeight:1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section id="requirements" style={{ padding:'72px 24px', background:'#f8fafc' }}>
        <div className="ft-container">
          <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#64748b', background:'#f1f5f9', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Eligibility</span>
          <h2 className="ft-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#0a1628', marginBottom:36 }}>Minimum Requirements</h2>
          <div className="ft-req-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
            <div className="ft-card">
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#0a1628', marginBottom:20 }}>Required</div>
              {['Minimum 2 years managing a retail team of 10+ people','Proven sales target achievement in a retail environment','Advanced English — spoken and written confidently','Experience in fashion, electronics, luxury, cosmetics, or similar retail','Valid passport and international travel readiness','Ability to commit to a 4-8 month onboard contract'].map(item => (
                <div key={item} className="ft-check">
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'#fef9ec', border:'1px solid #c9a84c', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize:14, color:'#334155', lineHeight:1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="ft-card">
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#64748b', marginBottom:20 }}>Preferred — strengthens your application</div>
              {['Duty-free or travel retail management experience','Experience leading multilingual or international teams','Luxury, cosmetics, perfume, or watch retail background','Previous cruise ship or hospitality management experience','KPI tracking and reporting experience','Second language beyond Spanish (French, Portuguese, Italian)'].map(item => (
                <div key={item} className="ft-check">
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'#f8fafc', border:'1px solid #cbd5e1', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop:20, background:'#fff', border:'1px solid #e2e8f0', borderLeft:'4px solid #ef4444', borderRadius:'0 12px 12px 0', padding:'16px 20px', display:'flex', gap:14 }}>
            <span style={{ fontSize:20, flexShrink:0 }}>⚠️</span>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#0a1628', marginBottom:4 }}>This is not an entry-level role</div>
              <div style={{ fontSize:13, color:'#64748b', lineHeight:1.6 }}>If you do not have experience managing a retail team of 10+ people, this role is not suitable at this time. We recommend <Link href="/apply" style={{ color:'#0d9488', fontWeight:600 }}>applying for the Retail Sales Associate position</Link> first and building your leadership track onboard.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ padding:'72px 24px', background:'#fff' }}>
        <div className="ft-container" style={{ maxWidth:680 }}>
          <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#64748b', background:'#f1f5f9', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Process</span>
          <h2 className="ft-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#0a1628', marginBottom:8 }}>How the application works</h2>
          <p style={{ fontSize:15, color:'#64748b', marginBottom:36, lineHeight:1.7 }}>Transparent, straightforward, and free at every step.</p>
          <div className="ft-card">
            {STEPS.map(s => (
              <div key={s.n} className="ft-step">
                <div className="ft-step-num">{s.n}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#0a1628', marginBottom:4 }}>{s.title}</div>
                  <div style={{ fontSize:13, color:'#64748b', lineHeight:1.65 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* TESTIMONIALS */}
      <section style={{ padding:'72px 24px', background:'#f8fafc' }}>
        <div className="ft-container">
          <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#64748b', background:'#fff', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Real Results</span>
          <h2 className="ft-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#0a1628', marginBottom:8 }}>Real people. Real results.</h2>
          <p style={{ fontSize:15, color:'#64748b', marginBottom:36, lineHeight:1.7 }}>Join 2,000+ candidates already working at sea.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
            {[
              { name:'Ruben De Jesus Hernandez', role:'Sales Associate', company:'Starboard Cruise Services', country:'Colombia 🇨🇴', quote:'The agency is very professional and the staff is very friendly. Placed within 3 weeks.' },
              { name:'Shalom Coba', role:'Sales Associate', company:'Harding Retail', country:'Colombia 🇨🇴', quote:'Selective Crew helped me get a job on a cruise ship and now I am traveling the world. Placed within a month.' },
              { name:'Evelin Hidalgo', role:'Retail Supervisor', company:'Starboard Cruise Services', country:'Colombia 🇨🇴', quote:'Went from applicant to Retail Supervisor within her first year.' },
            ].map(t => (
              <div key={t.name} className="ft-card" style={{ borderLeft:'3px solid #c9a84c' }}>
                <div style={{ display:'flex', gap:2, marginBottom:12 }}>
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color:'#c9a84c', fontSize:14 }}>★</span>)}
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
      {/* FORM */}
      <section id="apply" style={{ padding:'72px 24px', background:'#0a1628' }}>
        <div className="ft-container" style={{ maxWidth:680 }}>
          <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>Apply Now</span>
          <h2 className="ft-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#f8f4ec', marginBottom:8 }}>Fast Track Assistant Manager application</h2>
          <p style={{ fontSize:15, color:'rgba(248,244,236,0.55)', marginBottom:32, lineHeight:1.7 }}>Takes under 5 minutes. No documents needed in this first step.</p>

          {submitted ? (
            <div style={{ background:'rgba(201,168,76,0.12)', border:'1px solid rgba(201,168,76,0.25)', borderRadius:16, padding:'40px 32px', textAlign:'center' }}>
              {getRoute()==='priority'&&<><div style={{fontSize:40,marginBottom:16}}>⭐</div><div style={{fontSize:20,fontFamily:'Playfair Display,serif',color:'#f8f4ec',marginBottom:10}}>Strong leadership profile received</div><p style={{fontSize:14,color:'rgba(248,244,236,0.65)',lineHeight:1.7}}>Your experience matches what we are looking for. Our recruiter will contact you within 3-5 business days via WhatsApp to schedule a screening call.</p></>}
              {getRoute()==='apply'&&<><div style={{fontSize:40,marginBottom:16}}>✅</div><div style={{fontSize:20,fontFamily:'Playfair Display,serif',color:'#f8f4ec',marginBottom:10}}>Application received</div><p style={{fontSize:14,color:'rgba(248,244,236,0.65)',lineHeight:1.7}}>We will review your profile within 3-5 business days. If your management experience matches, we will contact you to schedule a screening call.</p></>}
              {getRoute()==='pool'&&<><div style={{fontSize:40,marginBottom:16}}>📋</div><div style={{fontSize:20,fontFamily:'Playfair Display,serif',color:'#f8f4ec',marginBottom:10}}>Added to priority pool</div><p style={{fontSize:14,color:'rgba(248,244,236,0.65)',lineHeight:1.7}}>Your management experience is relevant. We recommend strengthening your English level — when you are ready your profile will be prioritized.</p></>}
              {getRoute()==='prep'&&<><div style={{fontSize:40,marginBottom:16}}>💡</div><div style={{fontSize:20,fontFamily:'Playfair Display,serif',color:'#f8f4ec',marginBottom:10}}>Not quite ready for this role</div><p style={{fontSize:14,color:'rgba(248,244,236,0.65)',lineHeight:1.7}}>This Fast Track role requires managing a team of 10+. Consider <Link href="/apply" style={{color:'#c9a84c'}}>applying as a Sales Associate</Link> first to build your onboard management track.</p></>}
            </div>
          ) : (
            <form onSubmit={submit} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'32px 28px' }}>
              <div style={{ display:'flex', gap:8, marginBottom:28 }}>
                {[1,2].map(s=><div key={s} style={{ flex:1, height:4, borderRadius:4, background:step>=s?'#c9a84c':'rgba(255,255,255,0.1)', transition:'background 0.3s' }}/>)}
              </div>
              <div style={{ fontSize:11, color:'rgba(248,244,236,0.4)', marginBottom:20, letterSpacing:1 }}>STEP {step} OF 2 — {step===1?'YOUR PROFILE':'YOUR MANAGEMENT EXPERIENCE'}</div>

              {step===1&&(
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
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
                  <div><label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>English level *</label>
                    <select name="english" value={form.english} onChange={handle} required style={sel}>
                      <option value="">Select level</option>
                      <option>Basic — simple phrases only</option>
                      <option>Intermediate — can communicate but not fluent</option>
                      <option>Advanced — fully confident</option>
                      <option>Native / Fluent</option>
                    </select>
                  </div>
                  <button type="button" onClick={()=>{ if(form.name&&form.country&&form.whatsapp&&form.email&&form.english) setStep(2); }} className="ft-btn-gold" style={{ width:'100%', justifyContent:'center', marginTop:4 }}>Continue to Step 2 -{'>'}</button>
                </div>
              )}

              {step===2&&(
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div><label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Largest team managed *</label>
                      <select name="teamSize" value={form.teamSize} onChange={handle} required style={sel}>
                        <option value="">Select</option>
                        <option>1-5 people</option>
                        <option>5-10 people</option>
                        <option>10-20 people</option>
                        <option>20+ people</option>
                      </select>
                    </div>
                    <div><label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Years in management *</label>
                      <select name="yearsManagement" value={form.yearsManagement} onChange={handle} required style={sel}>
                        <option value="">Select</option>
                        <option>Less than 1 year</option>
                        <option>1-2 years</option>
                        <option>2-4 years</option>
                        <option>5+ years</option>
                      </select>
                    </div>
                  </div>
                  <div><label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Retail sector *</label>
                    <select name="sector" value={form.sector} onChange={handle} required style={sel}>
                      <option value="">Select main sector</option>
                      <option>Fashion / Apparel</option>
                      <option>Electronics / Technology</option>
                      <option>Luxury / Cosmetics / Fragrance</option>
                      <option>Jewelry / Watches</option>
                      <option>Airport Duty-Free</option>
                      <option>Department Store</option>
                      <option>Supermarket / FMCG</option>
                      <option>Other retail</option>
                    </select>
                  </div>
                  <div><label style={{ fontSize:12, fontWeight:600, color:'rgba(248,244,236,0.6)', display:'block', marginBottom:6 }}>Sales target experience *</label>
                    <select name="salesExperience" value={form.salesExperience} onChange={handle} required style={sel}>
                      <option value="">Select</option>
                      <option>Yes — I managed team sales targets and KPIs</option>
                      <option>Partial — some sales accountability</option>
                      <option>No — operations focused role</option>
                    </select>
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
                        <option>Exploring options — no firm date</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:10, marginTop:4 }}>
                    <div style={{marginBottom:20}}>
                    <label style={{fontSize:12,fontWeight:600,color:'rgba(248,244,236,0.7)',display:'block',marginBottom:6}}>Resume / CV <span style={{color:'#e85d4a'}}>*</span></label>
                    <div onClick={()=>document.getElementById('rir2').click()} style={{border:'2px dashed '+(resumeFile?'#0d9488':'rgba(255,255,255,0.2)'),borderRadius:12,padding:'18px',textAlign:'center',cursor:'pointer',background:resumeFile?'rgba(13,148,136,0.1)':'rgba(255,255,255,0.03)'}}>
                      {resumeFile?<p style={{fontSize:13,color:'#0d9488',fontWeight:600,margin:0}}>{resumeFile.name}</p>:<p style={{fontSize:13,color:'rgba(248,244,236,0.35)',margin:0}}>Click to upload resume (PDF, DOC, DOCX)</p>}
                    </div>
                    <input id="rir2" type="file" accept=".pdf,.doc,.docx" style={{display:'none'}} onChange={e=>handleResume(e.target.files[0])}/>
                  </div>
                  <button type="button" onClick={()=>setStep(1)} style={{ background:'rgba(255,255,255,0.06)', color:'rgba(248,244,236,0.6)', border:'1px solid rgba(255,255,255,0.1)', padding:'12px 20px', borderRadius:8, fontSize:14, fontFamily:'inherit', cursor:'pointer' }}>Back</button>
                    <button type="submit" disabled={busy} className="ft-btn-gold" style={{ flex:1, justifyContent:'center' }}>{busy?'Submitting...':'Submit Manager Application ->'}</button>
                  </div>
                </div>
              )}
              <div style={{ marginTop:16, fontSize:12, color:'rgba(248,244,236,0.3)', textAlign:'center' }}>Free to apply. No documents required in this step. We never share your data.</div>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:'72px 24px', background:'#fff' }}>
        <div className="ft-container" style={{ maxWidth:720 }}>
          <span style={{ display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#64748b', background:'#f1f5f9', borderRadius:100, padding:'4px 12px', marginBottom:12 }}>FAQ</span>
          <h2 className="ft-serif" style={{ fontSize:'clamp(22px,3vw,32px)', color:'#0a1628', marginBottom:36 }}>Common questions</h2>
          <div className="ft-card">
            {FAQS.map(faq=>(
              <div key={faq.q} className="ft-faq-item">
                <div style={{ fontSize:15, fontWeight:700, color:'#0a1628', marginBottom:8 }}>{faq.q}</div>
                <div style={{ fontSize:14, color:'#64748b', lineHeight:1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding:'72px 24px', background:'#0a1628', textAlign:'center' }}>
        <div className="ft-container" style={{ maxWidth:600 }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(201,168,76,0.15)', border:'1px solid rgba(201,168,76,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:22 }}>👥</div>
          <h2 className="ft-serif" style={{ fontSize:'clamp(22px,3.5vw,36px)', color:'#f8f4ec', marginBottom:12 }}>Ready to lead a cruise ship retail team?</h2>
          <p style={{ fontSize:15, color:'rgba(248,244,236,0.55)', lineHeight:1.8, marginBottom:32 }}>Free to apply. Leadership-first review. Our recruiter responds within 3-5 business days.</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="#apply" className="ft-btn-gold">Start Manager Application</a>
            <a href="#requirements" className="ft-btn-outline">Check Requirements First</a>
          </div>
          <div style={{ marginTop:28, display:'flex', justifyContent:'center', flexWrap:'wrap', gap:20 }}>
            {['Leadership-first review','Free to apply','Response in 3-5 days'].map(f=>(
              <span key={f} style={{ fontSize:12, color:'rgba(248,244,236,0.35)', display:'flex', alignItems:'center', gap:6 }}><span style={{ color:'#c9a84c' }}>✓</span> {f}</span>
            ))}
          </div>
          <div style={{ marginTop:32, paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize:12, color:'rgba(248,244,236,0.3)', marginBottom:10 }}>Also hiring</div>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/cruise-ship-photographer-jobs" style={{ fontSize:13, color:'rgba(248,244,236,0.5)', textDecoration:'none', padding:'6px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:100 }}>📸 Photographer Jobs</Link>
              <Link href="/apply" style={{ fontSize:13, color:'rgba(248,244,236,0.5)', textDecoration:'none', padding:'6px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:100 }}>🛍️ Sales Associate</Link>
              <Link href="/jobs" style={{ fontSize:13, color:'rgba(248,244,236,0.5)', textDecoration:'none', padding:'6px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:100 }}>All Open Positions</Link>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY */}
      <div className="ft-sticky">
        <a href="#apply" className="ft-btn-gold">Apply as Manager</a>
        <a href="#requirements" className="ft-btn-outline" style={{ flex:1, textAlign:'center', justifyContent:'center', fontSize:13, padding:'12px' }}>Requirements</a>
      </div>
    </>
  );
}
