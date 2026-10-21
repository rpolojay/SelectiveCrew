import Link from 'next/link';
import { notFound } from 'next/navigation';

const articles = {
  'first-time-cruise-guide': {
    title: 'Your First Cruise: A Practical Planning Guide',
    description: 'A clear introduction to planning your first cruise, from choosing an itinerary and cabin to embarkation day and budgeting.',
    category: 'START HERE',
    minutes: '12 min read',
    hero: 'light',
    image: '/images/cruise-travel/first-time-cruise-interior.jpg',
    imageAlt: 'Elegant cruise ship atrium with a grand illuminated glass staircase and crystal chandelier',
    intro: 'A first cruise can feel like several trips in one: transport, accommodation, dining, entertainment, and visits to multiple destinations. A little preparation makes the choices easier.',
    sections: [
      { heading: '1. Start with the itinerary', paragraphs: ['Choose the places you want to visit and the amount of time you want to spend ashore. Compare port times, the number of sea days, departure ports, and the season you plan to travel.', 'Check whether you need visas, entry authorizations, or other travel documents for every country on the route. Requirements depend on your nationality, itinerary, and current rules, so confirm them with official sources before paying.'] },
      { heading: '2. Compare the full cost', paragraphs: ['The advertised fare may not include everything you expect. Review taxes and fees, gratuities, drinks, specialty dining, internet, shore excursions, travel to the departure port, hotels before sailing, and travel protection.', 'Compare like with like: the same itinerary length, cabin category, fare conditions, and inclusions. Read cancellation and payment terms before booking.'] },
      { heading: '3. Choose a cabin that suits you', paragraphs: ['Inside cabins are usually the most economical; ocean-view cabins have a window; balcony cabins provide private outdoor space. Location can matter too, including walking distance to elevators and possible motion or noise.', 'If you are sensitive to motion, review the ship layout and ask a qualified travel professional about cabin location. No cabin can guarantee that you will not feel movement.'] },
      { heading: '4. Prepare for embarkation', paragraphs: ['Follow the cruise line’s instructions for check-in, required documents, luggage tags, arrival time, and prohibited items. Keep passports and essential medications in your hand luggage rather than checked bags.', 'Plan transport to the port with a sensible buffer. If travelling from another city or country, arriving the day before departure can reduce the risk of a delayed flight causing a missed sailing.'] },
      { heading: '5. Plan shore days without overpacking them', paragraphs: ['Research each port and decide which experiences matter most. Compare cruise-line excursions with independent options carefully, including meeting points, transport time, accessibility, cancellation terms, and the consequences of returning late.', 'Keep the ship’s all-aboard time visible and allow a buffer when returning independently. Port schedules can change.'] },
      { heading: 'First-cruise checklist', paragraphs: ['Confirm the itinerary, total price, payment schedule, cancellation policy, travel documents, insurance arrangements, transport to the port, and any health or accessibility needs.', 'Pack according to the route and dress guidance, and keep a copy of important booking details accessible offline. Recheck official cruise-line instructions close to departure.'] },
    ],
  },
  'best-caribbean-cruise-destinations': {
    title: 'Caribbean Cruise Destinations Worth Exploring',
    description: 'How to compare Caribbean cruise ports by beaches, culture, nature, activities, and the style of trip you want.',
    category: 'DESTINATION GUIDE',
    minutes: '7 min read',
    hero: 'light',
    image: '/images/cruise-travel/caribbean-crab-cay.jpg',
    imageAlt: 'Crab Cay islet in turquoise Caribbean water near Providencia island',
    intro: 'There is no single best Caribbean itinerary for everyone. The right route depends on whether you want relaxed beaches, local food and history, active excursions, or a mix of experiences.',
    sections: [
      { heading: 'Eastern Caribbean: island variety', paragraphs: ['Eastern Caribbean itineraries may include destinations known for beaches, sailing, island scenery, and a mix of French, Dutch, British, and other cultural influences. Compare the actual ports rather than choosing by region name alone.', 'Look at how long the ship stays in each port and whether the activities you want are close to the pier or require longer transfers.'] },
      { heading: 'Western Caribbean: history and outdoor activities', paragraphs: ['Depending on the itinerary, Western Caribbean calls can offer Mayan heritage, reef and marine activities, caves, beaches, and food experiences. Excursion availability and travel time vary by port.', 'For archaeological sites or nature excursions, check the time needed to reach the attraction, the amount of walking involved, heat exposure, and the operator’s cancellation terms.'] },
      { heading: 'Southern Caribbean: longer island explorations', paragraphs: ['Some Southern Caribbean routes include islands with distinctive landscapes, music, cuisine, and architecture. These itineraries may involve different departure ports or longer sailing distances, so compare flight costs and total travel time as well as the cruise fare.', 'If visiting several islands is a priority, map the ports and consider how much time you will actually have in each destination.'] },
      { heading: 'How to choose your ports', paragraphs: ['Make a short list of must-see experiences, then compare itineraries by port time, transport complexity, expected weather, accessibility, and excursion costs. A route with fewer ports and longer stays may suit you better than a busy schedule.', 'Read current destination and travel advisories from official sources. Local conditions, entry rules, and port arrangements can change.'] },
      { heading: 'Think beyond the headline fare', paragraphs: ['Add flights or other transport, pre-cruise accommodation, transfers, gratuities, excursions, meals not included in the fare, and any required documents. The cheapest advertised cruise may not be the least expensive trip overall.', 'If you are comparing cruises, use the same travel dates and cabin type where possible, and review what each fare includes before making a decision.'] },
    ],
  },
  'how-to-choose-a-cruise-line': {
    title: 'How to Choose the Right Cruise Line for You',
    description: 'Compare cruise lines by atmosphere, ship size, itinerary, onboard inclusions, dining, entertainment, and overall budget.',
    category: 'CRUISE PLANNING',
    minutes: '6 min read',
    hero: 'light',
    image: '/images/cruise-travel/cruise-line-ship-aerial.jpg',
    imageAlt: 'Aerial view of a full cruise ship sailing in vivid blue ocean water',
    intro: 'Cruise lines differ in atmosphere, ship design, dining, entertainment, service style, itinerary, and pricing. Start with the experience you want rather than assuming that the biggest ship or lowest fare is automatically the best fit.',
    sections: [
      { heading: '1. Decide what kind of trip you want', paragraphs: ['Think about your priorities: family activities, quiet spaces, nightlife, destination-focused travel, premium service, expedition experiences, or a relaxed trip with few decisions to make.', 'Read the itinerary and onboard activity descriptions for the specific ship and sailing. Experiences can vary within the same cruise line.'] },
      { heading: '2. Compare ships, not only brands', paragraphs: ['Ships within one company can differ in size, age, layout, venues, accessibility, and activities. Check the actual ship assigned to your departure and whether its facilities match your priorities.', 'Consider how you feel about crowds, walking distances, pool and dining availability, and the balance between time at sea and time in port.'] },
      { heading: '3. Read the fare details closely', paragraphs: ['Compare what is included in the fare and what costs extra: drinks, gratuities, Wi-Fi, specialty restaurants, excursions, room service, and other services. Package names and conditions differ between companies.', 'Review deposit rules, final payment dates, cancellation terms, fare changes, and any restrictions attached to promotional pricing.'] },
      { heading: '4. Match the itinerary to your pace', paragraphs: ['A port-intensive itinerary offers more opportunities to explore but may mean early starts and limited time onboard. A sailing with more sea days can provide a slower pace and more time to enjoy the ship.', 'Check departure and arrival ports, port times, seasonal conditions, and the transport needed to reach the terminal.'] },
      { heading: '5. Use reviews thoughtfully', paragraphs: ['Look for recent reviews of the specific ship and itinerary, and compare comments from travellers with priorities similar to yours. One person’s perfect vacation may be another person’s poor match.', 'Use reviews as one input alongside published inclusions, official policies, accessibility information, and the total trip budget.'] },
      { heading: 'A simple decision framework', paragraphs: ['Rank your top three priorities, set a realistic total budget, shortlist two or three itineraries, and compare the specific ship, cabin, port schedule, inclusions, and cancellation terms.', 'Before paying, confirm all details directly with the cruise line or booking provider and keep copies of the final terms.'] },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return { title: 'Cruise Travel Guide Not Found' };
  const canonical = `https://selectivecrew.com/cruise-travel/${slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical },
    keywords: ['cruise travel guide', 'cruise vacation planning', 'cruise destinations', 'cruise line comparison'],
    openGraph: {
      title: article.title,
      description: article.description,
      url: canonical,
      siteName: 'Selective Crew',
      type: 'article',
      images: [{ url: 'https://selectivecrew.com' + article.image, alt: article.imageAlt }],
    },
  };
}

export default async function CruiseTravelArticlePage({ params }) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();
  const relatedSlugs = Object.keys(articles).filter((s) => s !== slug);
  const lightHero = article.hero === 'light';
  const heroOverlay = lightHero
    ? 'linear-gradient(0deg, rgba(7,23,41,.34) 0%, rgba(7,23,41,.18) 45%, rgba(7,23,41,.18) 100%)'
    : 'linear-gradient(0deg, rgba(7,23,41,.88), rgba(7,23,41,.05))';
  const heroKickerShadow = lightHero ? '0 1px 8px rgba(7,23,41,.60)' : undefined;
  const heroTitleShadow = lightHero ? '0 2px 18px rgba(7,23,41,.55), 0 1px 4px rgba(7,23,41,.65)' : undefined;
  const heroDescShadow = lightHero ? '0 1px 10px rgba(7,23,41,.60)' : undefined;

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: 'https://selectivecrew.com' + article.image,
    author: { '@type': 'Organization', name: 'Selective Crew', url: 'https://selectivecrew.com' },
    publisher: { '@type': 'Organization', name: 'Selective Crew', url: 'https://selectivecrew.com' },
    mainEntityOfPage: `https://selectivecrew.com/cruise-travel/${slug}`,
  });

  return (
    <main style={{ background: '#fff', color: '#10253d', minHeight: '70vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <div style={{ position: 'relative', minHeight: 360, display: 'flex', alignItems: 'end', background: '#10253d', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: `${heroOverlay}, url('${article.image}')`, backgroundPosition: 'center', backgroundSize: 'cover' }} />
        <div style={{ position: 'relative', maxWidth: 900, width: '100%', margin: '0 auto', padding: '70px 24px 42px' }}>
          <p style={{ color: '#8fe1df', fontSize: 11, fontWeight: 800, letterSpacing: 2, margin: '0 0 14px', textShadow: heroKickerShadow }}>{article.category} · {article.minutes}</p>
          <h1 style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 500, lineHeight: 1.12, maxWidth: 800, margin: '0 0 14px', textShadow: heroTitleShadow }}>{article.title}</h1>
          <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 16, lineHeight: 1.75, maxWidth: 700, margin: 0, textShadow: heroDescShadow }}>{article.description}</p>
        </div>
      </div>

      <article style={{ maxWidth: 780, margin: '0 auto', padding: '42px 24px 72px' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, lineHeight: 1.7, color: '#263e54', margin: '0 0 34px' }}>{article.intro}</p>
        {article.sections.map((section) => (
          <section key={section.heading} style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 500, fontSize: 27, lineHeight: 1.3, margin: '0 0 12px' }}>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: '0 0 14px' }}>{paragraph}</p>)}
          </section>
        ))}

        {slug === 'first-time-cruise-guide' && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 500, fontSize: 27, lineHeight: 1.3, margin: '0 0 12px' }}>Compare Destinations: Caribbean, Alaska, Mediterranean, and Northern Europe</h2>
            <p style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: '0 0 14px' }}>The destination shapes everything else — season, budget, excursions, and daily pace. Use these general profiles to shortlist an itinerary style that matches your interests, then compare specific sailings within it.</p>
            <div style={{ overflowX: 'auto', margin: '0 0 14px' }}>
              <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse' }}>
                <caption style={{ textAlign: 'left', color: '#10253d', fontSize: 14, fontWeight: 700, padding: '0 0 8px' }}>Destination profiles for first-time cruisers</caption>
                <thead>
                  <tr>
                    <th scope="col" style={{ background: '#eef5f3', color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Destination</th>
                    <th scope="col" style={{ background: '#eef5f3', color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>What to know</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Caribbean</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}><ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}><li>Best suited to travelers interested in warm-weather destinations, beaches, island culture, and water activities.</li><li>Islands and ports differ widely — compare actual ports and port times rather than assuming every island offers the same experience. Our <Link href="/cruise-travel/best-caribbean-cruise-destinations" style={{ color: '#087f8c', fontWeight: 700, textDecoration: 'underline' }}>Caribbean destination guide</Link> compares ports in more detail.</li><li>Check the sailing season, port schedule, and excursion costs.</li></ul></td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Alaska</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}><ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}><li>Best suited to travelers interested in dramatic scenery, wildlife, glaciers, and nature-focused excursions.</li><li>Itinerary, time ashore, and excursion availability shape the experience.</li><li>Seasonal sailing schedules and weather conditions matter — the season is short.</li></ul></td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Mediterranean</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}><ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}><li>Best suited to travelers interested in historic cities, architecture, food, and cultural sightseeing.</li><li>Some itineraries are port-intensive and may involve transportation from the port to the main attractions.</li><li>Consider walking requirements, transport costs, and time available ashore.</li></ul></td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Northern Europe</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}><ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}><li>Best suited to travelers interested in fjords, coastal scenery, historic cities, and cultural experiences.</li><li>Itineraries and daylight conditions vary by season and destination.</li><li>Check port schedules, weather, and excursion logistics.</li></ul></td></tr>
                </tbody>
              </table>
            </div>
            <p style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: '0 0 14px' }}>These are general destination profiles to guide your shortlist, not guarantees of a particular experience — individual itineraries vary widely within each region.</p>
            <h3 style={{ color: '#4f5f6e', fontSize: 16, fontWeight: 700, lineHeight: 1.9, margin: '0 0 8px' }}>Match your priorities to a destination:</h3>
            <ul style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: '0 0 14px', paddingLeft: 22 }}>
              <li><strong>Warm weather and beach time?</strong> Start with Caribbean itineraries and compare ports, seasons, and excursion costs.</li>
              <li><strong>Glaciers, wildlife, and dramatic scenery?</strong> Consider Alaska and weigh time ashore against excursion availability.</li>
              <li><strong>Historic cities, food, and culture?</strong> Look at the Mediterranean and check walking demands and port-to-city transfers.</li>
              <li><strong>Fjords, coastal scenery, and northern cities?</strong> Explore Northern Europe and compare daylight, weather, and port schedules by season.</li>
            </ul>
            <p style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: 0 }}>Once you have a destination style in mind, see how a typical cruise week flows below, then compare cabin types and build your total trip budget.</p>
          </section>
        )}

        {slug === 'first-time-cruise-guide' && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 500, fontSize: 27, lineHeight: 1.3, margin: '0 0 12px' }}>What Does a 7-Night Cruise Itinerary Look Like?</h2>
            <p style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: '0 0 14px' }}>Below is one illustrative example of how a seven-night cruise week can be structured — an embarkation day, a mix of port visits and sea days, and a disembarkation day. It shows a pattern, not a real sailing schedule.</p>
            <div style={{ overflowX: 'auto', margin: '0 0 14px' }}>
              <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse' }}>
                <caption style={{ textAlign: 'left', color: '#10253d', fontSize: 14, fontWeight: 700, padding: '0 0 8px' }}>Illustrative day-by-day pattern for a 7-night cruise</caption>
                <thead>
                  <tr>
                    <th scope="col" style={{ background: '#eef5f3', color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Day</th>
                    <th scope="col" style={{ background: '#eef5f3', color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>What happens</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top', whiteSpace: 'nowrap' }}>Day 1 — Embarkation</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Arrive at the departure port with sufficient time, complete check-in, board, and attend required safety procedures.</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top', whiteSpace: 'nowrap' }}>Day 2 — At sea</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Explore the ship, review dining and activity options, and learn how onboard spending works.</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top', whiteSpace: 'nowrap' }}>Day 3 — Port visit</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Explore a destination independently or choose an optional shore excursion.</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top', whiteSpace: 'nowrap' }}>Day 4 — Port visit</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Experience another destination, allowing time for transportation and return-to-ship requirements.</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top', whiteSpace: 'nowrap' }}>Day 5 — At sea</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Enjoy onboard activities or rest; review the next port schedule.</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top', whiteSpace: 'nowrap' }}>Day 6 — Port visit</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Explore local attractions, keeping the ship’s all-aboard time in mind.</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top', whiteSpace: 'nowrap' }}>Day 7 — Final full day</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Enjoy the scheduled itinerary, review onboard charges, and follow the cruise line’s disembarkation instructions.</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top', whiteSpace: 'nowrap' }}>Day 8 — Disembarkation</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Leave the ship according to the assigned procedure and allow adequate time before onward transportation.</td></tr>
                </tbody>
              </table>
            </div>
            <p style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: '0 0 14px' }}>Actual cruise lengths, port sequences, sea days, departure times, and arrival times vary by ship, itinerary, and cruise line. Some seven-night cruises have more or fewer port calls or a different arrangement of sea days.</p>
            <h3 style={{ color: '#4f5f6e', fontSize: 16, fontWeight: 700, lineHeight: 1.9, margin: '0 0 8px' }}>Practical planning tips:</h3>
            <ul style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: '0 0 14px', paddingLeft: 22 }}>
              <li>Check the official itinerary and all-aboard times for each port.</li>
              <li>Allow sufficient time for transportation between the port and attractions.</li>
              <li>Confirm whether excursions are included or cost extra.</li>
              <li>Keep travel documents and essential items accessible.</li>
              <li>Review the cruise line’s embarkation and disembarkation instructions.</li>
              <li>Avoid scheduling flights too close to the expected arrival or departure procedures; verify the cruise line’s specific guidance for your sailing.</li>
            </ul>
            <p style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: 0 }}>With a picture of the week in mind, compare cabin types below to choose where you will sleep, then build your total trip budget.</p>
          </section>
        )}

        {slug === 'first-time-cruise-guide' && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 500, fontSize: 27, lineHeight: 1.3, margin: '0 0 12px' }}>Compare Cabin Types: Inside, Ocean-View, and Balcony</h2>
            <p style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: '0 0 14px' }}>The cabin sets your price baseline and your daily experience at sea. Use this side-by-side comparison to weigh price, natural light, outdoor space, privacy, and how you plan to spend your time.</p>
            <div style={{ overflowX: 'auto', margin: '0 0 14px' }}>
              <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse' }}>
                <caption style={{ textAlign: 'left', color: '#10253d', fontSize: 14, fontWeight: 700, padding: '0 0 8px' }}>Cabin trade-offs at a glance</caption>
                <thead>
                  <tr>
                    <th scope="col" style={{ background: '#eef5f3', color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Cabin category</th>
                    <th scope="col" style={{ background: '#eef5f3', color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Key trade-offs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Inside cabin</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}><ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}><li>No private exterior window.</li><li>Usually the most economical cabin category, although actual prices vary by sailing.</li><li>Suitable for travelers prioritizing budget and time spent exploring the ship and destinations.</li></ul></td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Ocean-view cabin</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}><ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}><li>A window or porthole providing natural light and an exterior view; the window generally does not open.</li><li>A possible middle ground for travelers who want daylight without paying for a balcony.</li></ul></td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Balcony cabin</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}><ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}><li>A private outdoor balcony, where specified by the cabin category, with outdoor space and views from the cabin.</li><li>Usually costs more than comparable inside cabins, but price differences vary by ship, itinerary, and sailing date.</li><li>Balcony space, privacy, views, and accessibility vary by cabin location and ship design.</li></ul></td></tr>
                </tbody>
              </table>
            </div>
            <p style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: '0 0 14px' }}>Not every ship offers all three categories, and the usual price order is not guaranteed on every sailing. Always compare the specific cabin types available on your ship and sailing date before deciding.</p>
            <h3 style={{ color: '#4f5f6e', fontSize: 16, fontWeight: 700, lineHeight: 1.9, margin: '0 0 8px' }}>A concise decision guide:</h3>
            <ul style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: '0 0 14px', paddingLeft: 22 }}>
              <li><strong>Choose inside</strong> if keeping costs down is the priority and you expect to spend little time in the cabin.</li>
              <li><strong>Choose ocean-view</strong> if natural light matters but a private outdoor area is not essential.</li>
              <li><strong>Choose balcony</strong> if private outdoor space and in-cabin views are worth the premium to you, and the specific balcony size, privacy, and location suit your needs.</li>
            </ul>
            <p style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: 0 }}>Once you have a cabin type in mind, use the cost breakdown below to see how it fits your total trip budget.</p>
          </section>
        )}

        {slug === 'first-time-cruise-guide' && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 500, fontSize: 27, lineHeight: 1.3, margin: '0 0 12px' }}>What Does a 7-Night Cruise Really Cost?</h2>
            <p style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: '0 0 14px' }}>The advertised fare is rarely the final number. Use the categories below to build a realistic total before you compare sailings, and confirm each line against the fare terms you are actually offered.</p>
            <div style={{ overflowX: 'auto', margin: '0 0 14px' }}>
              <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse' }}>
                <caption style={{ textAlign: 'left', color: '#10253d', fontSize: 14, fontWeight: 700, padding: '0 0 8px' }}>Common cost categories to review before booking</caption>
                <thead>
                  <tr>
                    <th scope="col" style={{ background: '#eef5f3', color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Cost category</th>
                    <th scope="col" style={{ background: '#eef5f3', color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>What to consider</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Cruise fare</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Advertised fare and what it includes</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Taxes and port fees</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Check whether these are included in the displayed price</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Gratuities</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Daily service charges and whether they are prepaid</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Drinks and dining</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Optional packages and specialty restaurants</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Flights and transfers</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Travel to the departure port and transportation</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Pre-cruise hotel</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Optional overnight accommodation before embarkation</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Shore excursions</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Cruise-line excursions or independent activities</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Onboard spending</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Wi-Fi, shopping, spa, and other optional purchases</td></tr>
                  <tr><th scope="row" style={{ color: '#263e54', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Travel insurance</th><td style={{ color: '#4f5f6e', fontSize: 14, padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Coverage, exclusions, and cancellation protection</td></tr>
                </tbody>
              </table>
            </div>
            <p style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: '0 0 14px' }}>Inclusions and mandatory charges vary by cruise line, itinerary, fare type, and booking terms. Some fares bundle gratuities, drinks, or Wi-Fi, while others price each item separately — so compare equivalent inclusions rather than headline fares alone.</p>
            <div style={{ border: '1px solid #e4e9e7', borderRadius: 4, background: '#f7faf9', padding: '20px 22px', margin: '0 0 14px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', color: '#10253d', fontSize: 19, fontWeight: 500, margin: '0 0 8px' }}>Illustrative example: one traveler, 7-night cruise</h3>
              <p style={{ color: '#4f5f6e', fontSize: 14, lineHeight: 1.8, margin: '0 0 12px' }}>Assumptions: one traveler sharing an interior cabin priced per person on a double-occupancy basis; a 7-night sailing in shoulder season; flying to the departure port with one pre-cruise hotel night; no beverage package; two mid-range shore excursions; and a basic travel insurance policy. Every amount below is a hypothetical figure chosen for illustration.</p>
              <div style={{ overflowX: 'auto', margin: '0 0 12px' }}>
                <table style={{ width: '100%', minWidth: 480, borderCollapse: 'collapse' }}>
                  <caption style={{ textAlign: 'left', color: '#637382', fontSize: 12, padding: '0 0 8px' }}>Hypothetical figures only — not quotes, averages, or guaranteed costs</caption>
                  <thead>
                    <tr>
                      <th scope="col" style={{ background: '#eef5f3', color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Item</th>
                      <th scope="col" style={{ background: '#eef5f3', color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'right', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Example amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><th scope="row" style={{ color: '#4f5f6e', fontSize: 14, fontWeight: 400, textAlign: 'left', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Cruise fare, per person</th><td style={{ color: '#4f5f6e', fontSize: 14, textAlign: 'right', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>$750</td></tr>
                    <tr><th scope="row" style={{ color: '#4f5f6e', fontSize: 14, fontWeight: 400, textAlign: 'left', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Taxes and port fees</th><td style={{ color: '#4f5f6e', fontSize: 14, textAlign: 'right', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>$145</td></tr>
                    <tr><th scope="row" style={{ color: '#4f5f6e', fontSize: 14, fontWeight: 400, textAlign: 'left', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Gratuities, 7 nights at about $16 per night</th><td style={{ color: '#4f5f6e', fontSize: 14, textAlign: 'right', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>$112</td></tr>
                    <tr><th scope="row" style={{ color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'left', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Cruise-related subtotal</th><td style={{ color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'right', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>$1,007</td></tr>
                    <tr><th scope="row" style={{ color: '#4f5f6e', fontSize: 14, fontWeight: 400, textAlign: 'left', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Round-trip flight to the departure port</th><td style={{ color: '#4f5f6e', fontSize: 14, textAlign: 'right', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>$380</td></tr>
                    <tr><th scope="row" style={{ color: '#4f5f6e', fontSize: 14, fontWeight: 400, textAlign: 'left', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Airport and port transfers</th><td style={{ color: '#4f5f6e', fontSize: 14, textAlign: 'right', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>$60</td></tr>
                    <tr><th scope="row" style={{ color: '#4f5f6e', fontSize: 14, fontWeight: 400, textAlign: 'left', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Pre-cruise hotel, one night</th><td style={{ color: '#4f5f6e', fontSize: 14, textAlign: 'right', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>$130</td></tr>
                    <tr><th scope="row" style={{ color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'left', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Travel subtotal</th><td style={{ color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'right', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>$570</td></tr>
                    <tr><th scope="row" style={{ color: '#4f5f6e', fontSize: 14, fontWeight: 400, textAlign: 'left', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Shore excursions, two mid-range outings</th><td style={{ color: '#4f5f6e', fontSize: 14, textAlign: 'right', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>$220</td></tr>
                    <tr><th scope="row" style={{ color: '#4f5f6e', fontSize: 14, fontWeight: 400, textAlign: 'left', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Onboard spending, Wi-Fi and incidentals</th><td style={{ color: '#4f5f6e', fontSize: 14, textAlign: 'right', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>$90</td></tr>
                    <tr><th scope="row" style={{ color: '#4f5f6e', fontSize: 14, fontWeight: 400, textAlign: 'left', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Travel insurance, basic policy</th><td style={{ color: '#4f5f6e', fontSize: 14, textAlign: 'right', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>$85</td></tr>
                    <tr><th scope="row" style={{ color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'left', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Optional spending subtotal</th><td style={{ color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'right', padding: '8px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>$395</td></tr>
                    <tr><th scope="row" style={{ background: '#eef5f3', color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'left', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>Estimated trip total (example)</th><td style={{ background: '#eef5f3', color: '#10253d', fontSize: 14, fontWeight: 700, textAlign: 'right', padding: '10px 12px', border: '1px solid #e4e9e7', verticalAlign: 'top' }}>$1,972</td></tr>
                  </tbody>
                </table>
              </div>
              <p style={{ color: '#4f5f6e', fontSize: 14, lineHeight: 1.8, margin: '0 0 12px' }}>Adding the three groups gives $1,007 + $570 + $395 = $1,972 for this hypothetical traveler — roughly two and a half times the advertised $750 fare.</p>
              <p style={{ color: '#637382', fontSize: 12, lineHeight: 1.8, margin: 0 }}>Cabin occupancy, departure port, destination, season, and travel dates can materially change the total; solo travelers, for example, are often charged a single supplement. Treat this as a budgeting method, not a live price, industry average, or guaranteed cost.</p>
            </div>
            <h3 style={{ color: '#4f5f6e', fontSize: 16, fontWeight: 700, lineHeight: 1.9, margin: '0 0 8px' }}>Before you book, answer these five budget questions:</h3>
            <ul style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: '0 0 14px', paddingLeft: 22 }}>
              <li>What is included in the advertised fare?</li>
              <li>Are taxes, port fees, and gratuities included?</li>
              <li>Which drinks, meals, and Wi-Fi services cost extra?</li>
              <li>What are the cancellation and change policies?</li>
              <li>What additional travel costs will be required?</li>
            </ul>
            <p style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: 0 }}>With written answers to each question, use the comparison checklist below to weigh your shortlisted sailings against each other.</p>
          </section>
        )}

        <aside style={{ background: '#eef5f3', borderLeft: '4px solid #087f8c', borderRadius: 4, padding: '22px 24px', margin: '36px 0' }}>
          {slug === 'first-time-cruise-guide' ? (
            <>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 500, margin: '0 0 8px' }}>Compare Cruise Options With Confidence</h2>
              <p style={{ color: '#4f5f6e', fontSize: 14, lineHeight: 1.8, margin: '0 0 12px' }}>Before you book, <Link href="/cruise-travel/how-to-choose-a-cruise-line" style={{ color: '#087f8c', fontWeight: 700, textDecoration: 'underline' }}>compare options</Link> on total value rather than the headline fare alone. Consider the total trip cost, the itinerary and port times, the cabin category and location, dining inclusions, gratuities, cancellation terms, transportation to and from the port, and the additional expenses you are likely to incur onboard and ashore.</p>
              <h3 style={{ color: '#4f5f6e', fontSize: 14, fontWeight: 700, lineHeight: 1.8, margin: '0 0 8px' }}>Final check before you pay or commit:</h3>
              <ul style={{ color: '#4f5f6e', fontSize: 14, lineHeight: 1.8, margin: '0 0 12px', paddingLeft: 20 }}>
                <li>What is the total price, including taxes, port fees, and gratuities?</li>
                <li>What exactly does the fare include — dining venues, drinks, Wi-Fi, entertainment, and room service?</li>
                <li>What are the payment schedule, cancellation terms, and refund conditions?</li>
                <li>Which cabin category and location am I booking, and could it change?</li>
                <li>How will I travel to and from the departure port, and what will that add to the budget?</li>
                <li>What additional onboard and onshore spending should I realistically expect?</li>
              </ul>
              <p style={{ color: '#637382', fontSize: 12, lineHeight: 1.8, margin: 0 }}>Affiliate links are always clearly identified when they appear. No booking recommendation or affiliate link is currently offered in this section.</p>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 500, margin: '0 0 8px' }}>Booking partner links</h2>
          <p style={{ color: '#4f5f6e', fontSize: 14, lineHeight: 1.8, margin: 0 }}>Affiliate booking links may be added here after a partnership is approved. No affiliate link is active in this guide at this time.</p>
            </>
          )}
        </aside>

        {slug === 'first-time-cruise-guide' && (
          <p style={{ color: '#4f5f6e', fontSize: 16, lineHeight: 1.9, margin: '0 0 28px' }}>You now have a complete planning path: shortlist a destination style, picture your cruise week, choose a cabin type, estimate the full trip cost, and run the final checklist before you pay. Work through each step with written answers, and compare specific sailings on equal terms before committing.</p>
        )}

        <div style={{ borderTop: '1px solid #e4e9e7', paddingTop: 24, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/cruise-travel" style={{ color: '#087f8c', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>← ALL CRUISE TRAVEL GUIDES</Link>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            {relatedSlugs.map((related) => (
              <Link key={related} href={`/cruise-travel/${related}`} style={{ color: '#087f8c', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>{articles[related].title} ↗</Link>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
