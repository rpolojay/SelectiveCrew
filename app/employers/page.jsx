'use client';
import { useState } from 'react';

const navy = '#0a1628';
const teal = '#0d9488';
const gold = '#c9a84c';

const WHATSAPP_NUMBER = '573188474058';
const WHATSAPP_MESSAGE = "Hello Selective Crew team, I would like to discuss recruiting talent in Latin America.";
const WHATSAPP_URL = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE);

const HOW_IT_WORKS = [
  { step: '01', title: 'We Align on the Role', desc: 'We define the position, candidate profile, and hiring priorities with your team.' },
  { step: '02', title: 'We Recruit & Coordinate', desc: 'Our team sources, screens, and coordinates candidates against the agreed profile.' },
  { step: '03', title: 'Review the Pipeline', desc: 'Review candidate profiles and progress in a private portal, with our team managing the recruiting process.' },
];

const PORTAL_FEATURES = [
  { icon: '\u{1F4CA}', label: 'Regular pipeline updates' },
  { icon: '\u{1F4CB}', label: 'Candidate status tracking' },
  { icon: '\u{1F4C5}', label: 'Interview confirmation tracking' },
  { icon: '\u{1F465}', label: 'Candidates assigned to your searches' },
  { icon: '\u{1F4F1}', label: 'Mobile friendly' },
];

const STATS = [
  { value: '2,000+', label: 'Candidates Placed Since 2009' },
  { value: '11', label: 'Latin American Countries' },
  { value: '17', label: 'Years of Experience' },
  { value: 'MLC 2006', label: 'Compliant' },
];

const CRUISE_LINES = [
  { name: 'Starboard Retail Group', desc: 'Retail Sales Associates and Fine Jewelry Specialists' },
  { name: 'Norwegian Cruise Line', desc: 'Photography Department' },
  { name: 'Grand Circle Cruise Line', desc: 'Shipboard positions' },
];

export default function EmployersPage() {
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', positions: '', hires: '', locations: '', timeline: '', needs: '' });
  const [focused, setFocused] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const inputStyle = (field) => ({
    width: '100%',
    border: '1.5px solid ' + (focused === field ? teal : '#dde5f0'),
    borderRadius: 10,
    padding: '12px 16px',
    fontSize: 14,
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box',
    color: navy,
    fontFamily: 'inherit',
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/employer-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch (e) {
      console.error('Failed to send demo request:', e);
      setError('Something went wrong. Please try again or contact us via WhatsApp.');
    }
    setSubmitting(false);
  }

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", color: navy, background: '#fff' }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,' + navy + ' 0%,#0e4d8a 100%)', color: '#fff', padding: '96px 20px 88px', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: 'uppercase', marginBottom: 16 }}>
            LATAM RECRUITING AS A SERVICE
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(32px,4.5vw,48px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
            Qualified Latin American talent, managed through our proprietary candidate pipeline.
          </h1>
          <p style={{ fontSize: 17, color: '#b8d0f0', lineHeight: 1.8, maxWidth: 620, margin: '0 auto 40px' }}>
            For U.S. companies hiring qualified talent in Latin America, from a focused search to recurring, multi-role hiring. Cruise and hospitality recruiting is a core area of expertise, while the service supports broader LATAM talent needs.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#recruiting-inquiry"
              style={{ display: 'inline-block', background: gold, color: navy, padding: '15px 34px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
              Request a Recruiting Consultation &#8594;
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)', padding: '15px 24px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              Message us on WhatsApp
            </a>
            <a href="/jobs"
              style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)', padding: '15px 34px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              View Open Positions
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 20px', background: '#f8faff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: teal, textTransform: 'uppercase', marginBottom: 10 }}>
              How It Works
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(26px,3.2vw,36px)', fontWeight: 700, color: navy }}>
              A Simple, Transparent Process
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} style={{ background: '#fff', borderRadius: 18, padding: '32px 28px', border: '1px solid #e0e8f5', boxShadow: '0 2px 16px rgba(14,77,138,0.06)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: navy, color: gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, marginBottom: 18 }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: navy, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Engagements */}
      <section style={{ padding: '72px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: teal, textTransform: 'uppercase', marginBottom: 10 }}>Flexible Recruiting Engagements</div>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(26px,3.2vw,36px)', fontWeight: 700, color: navy, marginBottom: 12 }}>Recruiting Support That Fits Your Hiring Needs</h2>
            <p style={{ fontSize: 15, color: '#666', maxWidth: 660, margin: '0 auto', lineHeight: 1.7 }}>We will define the scope, cadence, and commercial model with you before work begins. No public RaaS prices are being quoted.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20 }}>
            {[
              { title: 'Recruiting Project', desc: 'For a defined role or hiring need. Includes an intake, agreed candidate profile, sourcing and screening, a client-reviewed shortlist, and interview coordination. Progress is shared weekly while the search is active. Scope is limited to the roles, markets, and campaign period agreed before kickoff; hiring outcomes and time-to-fill are not guaranteed.' },
              { title: 'Recruiting as a Service', desc: 'For recurring hiring needs. Includes ongoing role intake, sourcing and screening, interview coordination, and pipeline visibility, with a weekly working update and a monthly priorities review. Active role count, response cadence, and recruiting capacity are agreed for each engagement; additional roles or markets require a scope review.' },
              { title: 'Managed LATAM Recruiting', desc: 'For multi-role or multi-market hiring. Includes a jointly planned recruiting program, coordinated sourcing and screening, interview operations, and shared pipeline reporting. Meeting cadence and capacity are set in the engagement plan. New countries, role families, or material volume changes are reviewed before being added.' },
            ].map((service) => (
              <article key={service.title} style={{ background: '#f8faff', border: '1px solid #e0e8f5', borderRadius: 16, padding: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: navy, marginBottom: 10 }}>{service.title}</h3>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0 }}>{service.desc}</p>
              </article>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 24 }}>Need a dedicated remote team member instead? <a href="/remote-staffing" style={{ color: teal, fontWeight: 700 }}>Explore Remote Staffing</a>.</p>
        </div>
      </section>

      {/* Portal Features */}
      <section style={{ padding: '80px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: teal, textTransform: 'uppercase', marginBottom: 10 }}>
              PIPELINE VISIBILITY INCLUDED IN THE SERVICE
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(26px,3.2vw,36px)', fontWeight: 700, color: navy, marginBottom: 12 }}>
              A Shared View of Your Recruiting Pipeline
            </h2>
            <p style={{ fontSize: 15, color: '#666', maxWidth: 560, margin: '0 auto' }}>
              We recruit the candidates and give your team visibility into the pipeline for your searches. Our team manages sourcing, screening, and coordination; the portal is included as part of the recruiting service.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {PORTAL_FEATURES.map((f) => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#f8faff', borderRadius: 14, padding: '18px 20px', border: '1px solid #e8eef8' }}>
                <span style={{ fontSize: 26, flexShrink: 0 }}>{f.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: navy }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '72px 20px', background: navy }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 24 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: gold, marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#b8d0f0', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recruiting Experience */}
      <section style={{ padding: '80px 20px', background: '#f8faff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: teal, textTransform: 'uppercase', marginBottom: 10 }}>
              Trusted Partners
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(26px,3.2vw,36px)', fontWeight: 700, color: navy }}>
              Recruiting Experience
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
            {CRUISE_LINES.map((c) => (
              <div key={c.name} style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', border: '1px solid #e0e8f5', textAlign: 'center' }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: navy, marginBottom: 8 }}>{c.name}</h3>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruiting Inquiry */}
      <section id="recruiting-inquiry" style={{ padding: '80px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: teal, textTransform: 'uppercase', marginBottom: 10 }}>
              Get Started
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(26px,3.2vw,36px)', fontWeight: 700, color: navy, marginBottom: 12 }}>
              Talk with Our Recruiting Team
            </h2>
            <p style={{ fontSize: 15, color: '#666' }}>
              Tell us about your hiring needs. We will discuss the right recruiting approach and show how we manage your candidate pipeline.
            </p>
          </div>

          {submitted ? (
            <div style={{ background: '#f0fdf4', border: '2px solid #16a34a', borderRadius: 16, padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>&#9989;</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: navy, marginBottom: 8 }}>Thank You!</h3>
              <p style={{ fontSize: 14, color: '#555', margin: 0 }}>
                We have received your inquiry and will be in touch shortly to discuss your hiring needs.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: '#f8faff', borderRadius: 16, padding: 32, border: '1px solid #e0e8f5' }}>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="employer-company" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>Company *</label>
                <input id="employer-company" type="text" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                  onFocus={() => setFocused('company')} onBlur={() => setFocused('')}
                  placeholder="e.g. Royal Caribbean" style={inputStyle('company')} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="employer-name" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>Contact name *</label>
                <input id="employer-name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  placeholder="Your full name" style={inputStyle('name')} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="employer-email" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>Work email *</label>
                <input id="employer-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  placeholder="you@company.com" style={inputStyle('email')} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label htmlFor="employer-phone" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>Phone (optional)</label>
                <input id="employer-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                  placeholder="+1 (555) 000-0000" style={inputStyle('phone')} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="employer-positions" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>Positions or roles needed *</label>
                <input id="employer-positions" type="text" required value={form.positions} onChange={(e) => setForm({ ...form, positions: e.target.value })} placeholder="e.g. Customer support, sales, operations" style={inputStyle('positions')} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="employer-hires" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>Number of hires *</label>
                <input id="employer-hires" type="number" min="1" required value={form.hires} onChange={(e) => setForm({ ...form, hires: e.target.value })} placeholder="e.g. 3" style={inputStyle('hires')} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="employer-locations" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>Countries or locations *</label>
                <input id="employer-locations" type="text" required value={form.locations} onChange={(e) => setForm({ ...form, locations: e.target.value })} placeholder="e.g. Colombia, Mexico" style={inputStyle('locations')} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="employer-timeline" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>Hiring timeline *</label>
                <input id="employer-timeline" type="text" required value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} placeholder="e.g. Within 2 months" style={inputStyle('timeline')} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label htmlFor="employer-needs" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>Describe your hiring needs</label>
                <textarea id="employer-needs" rows={4} value={form.needs} onChange={(e) => setForm({ ...form, needs: e.target.value })} placeholder="Share the skills, experience, or hiring context we should know." style={inputStyle('needs')} />
              </div>
              {error && <p style={{ fontSize: 13, color: '#dc2626', marginBottom: 16 }}>{error}</p>}
              <button type="submit" disabled={submitting}
                style={{ width: '100%', background: navy, color: '#fff', border: 'none', borderRadius: 12, padding: 15, fontSize: 15, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Sending...' : 'Talk with Our Recruiting Team →'}
              </button>
              <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 14 }}>
                Prefer WhatsApp? <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ color: teal, fontWeight: 700, textDecoration: 'none' }}>Message us at +57 318 847 4058</a>
              </p>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
