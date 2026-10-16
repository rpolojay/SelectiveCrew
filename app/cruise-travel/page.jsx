import Link from 'next/link';

const guides = [
  {
    slug: 'first-time-cruise-guide',
    category: 'START HERE',
    title: 'Your First Cruise: A Practical Planning Guide',
    description: 'Understand what to book, what to pack, how embarkation works, and which extra costs to plan for before you sail.',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Cruise ship sailing across blue ocean water',
    read: '8 min read',
  },
  {
    slug: 'best-caribbean-cruise-destinations',
    category: 'DESTINATION GUIDE',
    title: 'Caribbean Cruise Destinations Worth Exploring',
    description: 'Compare island experiences, beaches, culture, nature, and shore excursions as you plan a Caribbean itinerary.',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Tropical Caribbean coastline with turquoise water',
    read: '7 min read',
  },
  {
    slug: 'how-to-choose-a-cruise-line',
    category: 'CRUISE PLANNING',
    title: 'How to Choose the Right Cruise Line for You',
    description: 'Match your travel style, budget, preferred onboard atmosphere, and itinerary to the cruise experience that suits you.',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Large cruise ship viewed from the water',
    read: '6 min read',
  },
];

const ink = '#10253d';
const muted = '#5b6b7c';
const teal = '#087f8c';

export default function CruiseTravelPage() {
  return (
    <main style={{ background: '#f7f8f5', color: ink, minHeight: '70vh' }}>
      <section style={{ position: 'relative', minHeight: 470, display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#10253d' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: "linear-gradient(90deg, rgba(7,23,41,.88) 0%, rgba(7,23,41,.62) 48%, rgba(7,23,41,.08) 100%), url('https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=2200&q=90')", backgroundPosition: 'center 54%', backgroundSize: 'cover' }} />
        <div style={{ position: 'relative', maxWidth: 1180, width: '100%', margin: '0 auto', padding: '84px 24px 90px' }}>
          <p style={{ color: '#8fe1df', fontSize: 12, letterSpacing: 3, fontWeight: 800, marginBottom: 18 }}>THE CRUISE TRAVEL EDIT</p>
          <h1 style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: 'clamp(38px, 6vw, 70px)', lineHeight: 1.04, maxWidth: 720, fontWeight: 500, margin: '0 0 22px' }}>Find your next horizon.</h1>
          <p style={{ color: 'rgba(255,255,255,.88)', fontSize: 18, lineHeight: 1.8, maxWidth: 620, margin: '0 0 30px' }}>Thoughtful cruise guides for choosing a voyage, discovering destinations, and planning a vacation that feels right for you.</p>
          <a href="#guides" style={{ display: 'inline-block', background: '#f2c66d', color: '#10253d', borderRadius: 4, padding: '14px 22px', textDecoration: 'none', fontSize: 14, fontWeight: 800 }}>EXPLORE THE GUIDES ↓</a>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '58px 24px 26px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 22, alignItems: 'stretch' }}>
          <div style={{ background: '#e7f1ef', padding: '28px 30px', borderRadius: 8 }}>
            <p style={{ color: teal, fontSize: 11, fontWeight: 800, letterSpacing: 2, margin: '0 0 12px' }}>PLAN WITH CONFIDENCE</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 27, fontWeight: 500, lineHeight: 1.25, margin: '0 0 12px' }}>Less guesswork. More getaway.</h2>
            <p style={{ color: muted, lineHeight: 1.8, fontSize: 14, margin: 0 }}>Start with the essentials: timing, itinerary, cabin choices, onboard costs, and the details that make travel smoother.</p>
          </div>
          <div style={{ background: '#fff', padding: '28px 30px', borderRadius: 8, border: '1px solid #e6e9e5' }}>
            <p style={{ color: teal, fontSize: 11, fontWeight: 800, letterSpacing: 2, margin: '0 0 12px' }}>DESTINATIONS</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 27, fontWeight: 500, lineHeight: 1.25, margin: '0 0 12px' }}>Choose the journey, not just the ship.</h2>
            <p style={{ color: muted, lineHeight: 1.8, fontSize: 14, margin: 0 }}>Think about beaches, food, history, outdoor adventures, port time, and how much exploring you want to do ashore.</p>
          </div>
          <div style={{ background: '#fff', padding: '28px 30px', borderRadius: 8, border: '1px solid #e6e9e5' }}>
            <p style={{ color: teal, fontSize: 11, fontWeight: 800, letterSpacing: 2, margin: '0 0 12px' }}>TRAVEL SMART</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 27, fontWeight: 500, lineHeight: 1.25, margin: '0 0 12px' }}>Know what your fare includes.</h2>
            <p style={{ color: muted, lineHeight: 1.8, fontSize: 14, margin: 0 }}>Compare the full trip cost, including transport to the port, gratuities, drinks, internet, excursions, and travel protection.</p>
          </div>
        </div>
      </section>

      <section id="guides" style={{ maxWidth: 1180, margin: '0 auto', padding: '54px 24px 76px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 18, flexWrap: 'wrap', marginBottom: 26 }}>
          <div>
            <p style={{ color: teal, fontSize: 11, fontWeight: 800, letterSpacing: 2, margin: '0 0 10px' }}>THE EDITOR'S PICKS</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 500, fontSize: 'clamp(30px, 4vw, 43px)', margin: 0 }}>Cruise planning, made clearer.</h2>
          </div>
          <p style={{ color: muted, fontSize: 13, maxWidth: 330, lineHeight: 1.7, margin: 0 }}>Practical, independent guides to help you ask better questions before booking.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 24 }}>
          {guides.map((guide) => (
            <article key={guide.slug} style={{ background: '#fff', border: '1px solid #e5e9e5', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Link href={`/cruise-travel/${guide.slug}`} aria-label={`Read ${guide.title}`} style={{ display: 'block', overflow: 'hidden' }}>
                <img src={guide.image} alt={guide.imageAlt} loading="lazy" style={{ display: 'block', width: '100%', height: 220, objectFit: 'cover' }} />
              </Link>
              <div style={{ padding: '23px 24px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p style={{ color: teal, fontSize: 10, fontWeight: 800, letterSpacing: 1.6, margin: '0 0 12px' }}>{guide.category} <span style={{ color: '#9aa5ae', fontWeight: 500 }}>· {guide.read}</span></p>
                <h3 style={{ fontFamily: 'Georgia, serif', fontWeight: 500, fontSize: 25, lineHeight: 1.25, margin: '0 0 12px' }}>{guide.title}</h3>
                <p style={{ color: muted, fontSize: 14, lineHeight: 1.8, margin: '0 0 22px', flex: 1 }}>{guide.description}</p>
                <Link href={`/cruise-travel/${guide.slug}`} style={{ color: teal, textDecoration: 'none', fontSize: 13, fontWeight: 800 }}>READ THE GUIDE ↗</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ background: '#10253d', color: '#fff', padding: '42px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: '#8fe1df', fontSize: 11, letterSpacing: 2, fontWeight: 800, margin: '0 0 8px' }}>A NOTE ON BOOKINGS</p>
            <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 14, lineHeight: 1.7, maxWidth: 690, margin: 0 }}>We are building our cruise travel resources. Any future booking-partner links will be identified clearly. No booking partner is endorsed or linked here yet.</p>
          </div>
          <span style={{ border: '1px solid rgba(255,255,255,.25)', borderRadius: 4, padding: '10px 14px', fontSize: 11, letterSpacing: 1, color: '#fff' }}>TRAVEL GUIDES</span>
        </div>
      </section>
    </main>
  );
}
