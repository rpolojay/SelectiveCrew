import Link from 'next/link';
import { notFound } from 'next/navigation';

const articles = {
  'first-time-cruise-guide': {
    title: 'Your First Cruise: A Practical Planning Guide',
    description: 'A clear introduction to planning your first cruise, from choosing an itinerary and cabin to embarkation day and budgeting.',
    category: 'START HERE',
    minutes: '8 min read',
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

        <aside style={{ background: '#eef5f3', borderLeft: '4px solid #087f8c', borderRadius: 4, padding: '22px 24px', margin: '36px 0' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 500, margin: '0 0 8px' }}>Booking partner links</h2>
          <p style={{ color: '#4f5f6e', fontSize: 14, lineHeight: 1.8, margin: 0 }}>Affiliate booking links may be added here after a partnership is approved. No affiliate link is active in this guide at this time.</p>
          <p style={{ color: '#637382', fontSize: 11, margin: '12px 0 0' }}>[AFFILIATE LINK PLACEHOLDER — DO NOT PUBLISH A BOOKING URL UNTIL APPROVED]</p>
        </aside>

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
