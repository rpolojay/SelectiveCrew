'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { completeModule, saveQuizResult, issueCertificate } from '../../../lib/tracking';

// ─── COURSE DATA ────────────────────────────────────────────────────────────

const MODULES = [
  {
    id: 0,
    title: 'The Onboard Retail World',
    subtitle: 'Understanding your role, the environment, and what makes cruise retail unique',
    icon: '🚢',
    color: '#0a1628',
    accent: '#c9a84c',
    lessons: [
      {
        id: 'l0a',
        title: 'Your Stage: The Ship',
        type: 'lesson',
        content: {
          headline: 'You are not just a salesperson. You are part of the guest experience.',
          body: `Cruise ship retail is unlike any retail environment on land. Your customers are on vacation — relaxed, celebratory, and emotionally open to spending. The duty-free shop is not a store they pass by. It is a destination they seek out.\n\nGuests spend an average of $150–$400 per voyage on duty-free goods. The top 20% of retail crew members generate over 60% of total onboard retail revenue. The difference between average and exceptional is not luck — it is knowledge, approach, and technique.`,
          visual: 'ship',
          facts: [
            { num: '$400', label: 'Average spend per guest per voyage' },
            { num: '40%', label: 'Savings vs home-country retail prices' },
            { num: '7 days', label: 'Average time you have to build a relationship' },
          ],
        },
      },
      {
        id: 'l0b',
        title: 'The Duty-Free Advantage',
        type: 'lesson',
        content: {
          headline: 'The price difference is real. Your job is to make guests feel it.',
          body: `Duty-free goods are exempt from import taxes and customs duties. This creates genuine savings — not marketing spin. A bottle of Johnnie Walker Blue that retails for $280 at home costs $195 duty-free. A Chanel perfume set at $180 ashore is $115 onboard.\n\nWhen you internalize these numbers, your confidence becomes contagious. Guests sense when you believe in what you are selling. Lead with the saving, anchor it to a specific product, and watch hesitation dissolve.`,
          visual: 'savings',
          facts: [
            { num: '20–35%', label: 'Savings on spirits and wine' },
            { num: '25–40%', label: 'Savings on perfumes and cosmetics' },
            { num: '15–30%', label: 'Savings on watches and jewelry' },
          ],
        },
      },
      {
        id: 'l0c',
        title: 'Scenario Practice',
        type: 'scenario',
        scenarios: [
          {
            id: 's0c1',
            setup: 'Day 1 at sea. A couple stops at your shop entrance and peers in hesitantly.',
            situation: 'Guest says: "We never really buy anything duty-free. It never seems worth it."',
            choices: [
              { text: 'Say "No problem, feel free to browse!" and step back.', outcome: 'bad', feedback: 'You missed the opening. Their statement was an invitation to educate, not a rejection. Stepping back signals agreement that it is not worth it.' },
              { text: 'Ask "What do you usually buy back home — spirits, perfume, skincare?" Then show the price difference on a specific item.', outcome: 'great', feedback: 'Perfect. You turned skepticism into curiosity by making it personal and concrete. A real number on a real product is worth more than any pitch.' },
              { text: 'Tell them about your current promotions and special offers.', outcome: 'ok', feedback: 'Promotions can help, but you skipped the most important step — finding out what they actually want. Lead with curiosity, not catalog.' },
            ],
          },
          {
            id: 's0c2',
            setup: 'A solo traveler, mid-40s, walks in looking at the whisky section.',
            situation: 'He picks up a bottle, checks the price, and puts it back down.',
            choices: [
              { text: '"That is one of our most popular bottles. Can I tell you about it?"', outcome: 'ok', feedback: 'Better than silence, but "most popular" is a cliché. It does not connect to what he just did — which was check the price and hesitate.' },
              { text: '"I noticed you looked at the price — that one is actually 28% cheaper than duty-paid retail. Would you like to compare?"', outcome: 'great', feedback: 'Excellent observation skills. You named what you saw, anchored to a specific saving, and offered something useful. This builds instant trust.' },
              { text: 'Wait for him to come to you.', outcome: 'bad', feedback: 'Waiting is a lost sale. He came in with interest. A warm, observant opener would have converted that interest into a conversation.' },
            ],
          },
        ],
      },
    ],
    quiz: [
      { q: 'What is the average duty-free spend per cruise guest per voyage?', opts: ['$50–$100', '$150–$400', '$500–$800', '$1,000+'], correct: 1, exp: 'Guests spend $150–$400 on average, making each interaction high-value.' },
      { q: 'What savings can guests expect on perfumes and cosmetics duty-free?', opts: ['5–10%', '10–15%', '25–40%', '50–60%'], correct: 2, exp: 'Perfumes and cosmetics offer the highest savings at 25–40% vs home retail.' },
      { q: 'A guest says duty-free "never seems worth it." Your best response is:', opts: ['Agree and let them browse', 'Show a specific product with a specific price saving', 'Hand them a promotions flyer', 'Offer a discount'], correct: 1, exp: 'Specific numbers on real products turn skepticism into curiosity every time.' },
      { q: 'What percentage of revenue do the top 20% of retail crew generate?', opts: ['20%', '40%', '60%', '80%'], correct: 2, exp: 'The top 20% generate over 60% of revenue — knowledge and technique make the difference.' },
    ],
  },
  {
    id: 1,
    title: 'Product Mastery',
    subtitle: 'Know your products cold — what to say, what to highlight, and how to pair',
    icon: '🥃',
    color: '#1a3a5c',
    accent: '#e8d5a0',
    lessons: [
      {
        id: 'l1a',
        title: 'Spirits & Wine',
        type: 'lesson',
        content: {
          headline: 'Spirits are your highest-volume category. Master the top 10 SKUs.',
          body: `Whisky, rum, cognac, gin, champagne — these are your core. Guests buying spirits fall into three types: the Connoisseur (knows exactly what they want), the Gift Buyer (buying for someone else), and the Explorer (open to discovery).\n\nFor Connoisseurs: match their knowledge, offer limited editions, highlight age statements.\nFor Gift Buyers: ask about the recipient, suggest gift sets, emphasize the price saving as part of the gift value.\nFor Explorers: offer a tasting note, compare two options, let them decide between good and great.`,
          visual: 'spirits',
          facts: [
            { num: 'Top 5', label: 'SKUs to memorize: Glenfiddich 12, Johnnie Walker Blue, Hennessy VS, Bacardi 8yr, Veuve Clicquot' },
            { num: '3 types', label: 'Of spirit buyers — each needs a different approach' },
            { num: 'Gift sets', label: 'Increase average transaction value by 35%' },
          ],
        },
      },
      {
        id: 'l1b',
        title: 'Perfume & Cosmetics',
        type: 'lesson',
        content: {
          headline: 'The largest revenue category. Master fragrance families and the sample close.',
          body: `Perfume sells on emotion and experience, not logic. Your job is to create a moment — a spritz on the wrist, a pause, a reaction. The sale follows the feeling.\n\nFragrance families to know: Floral (romantic, feminine), Woody (warm, sophisticated), Oriental (sensual, bold), Fresh (clean, energetic), Gourmand (sweet, playful). Ask about occasion, personality, and what they currently wear before recommending anything.\n\nCosmetics: Travel-exclusive sets are the highest converters. The phrase "this set is only available onboard" closes more sales than any discount.`,
          visual: 'perfume',
          facts: [
            { num: '5', label: 'Fragrance families every crew member must know' },
            { num: 'Sample first', label: 'Always offer a sample before suggesting a purchase' },
            { num: 'Exclusive sets', label: 'Are your strongest close — unavailable at home retail' },
          ],
        },
      },
      {
        id: 'l1c',
        title: 'Watches, Jewelry & Accessories',
        type: 'lesson',
        content: {
          headline: 'High-ticket items require trust first, pitch second.',
          body: `Never lead with price on jewelry or watches. Lead with the story — the craftsmanship, the occasion, the meaning. A watch is not a timepiece, it is a milestone marker. A bracelet is not metal, it is a memory from a voyage.\n\nBuild rapport before you build a case. Ask if they are celebrating something. If they are on a honeymoon, anniversary, or birthday — you have a natural close already written. Emphasize authenticity, warranty, and the tax saving as a bonus, not the headline.`,
          visual: 'jewelry',
          facts: [
            { num: 'Story first', label: 'Lead with occasion and meaning, never price' },
            { num: 'Warranty', label: 'International manufacturer warranty is a key differentiator' },
            { num: '15–30%', label: 'Tax savings — mention as a bonus after building desire' },
          ],
        },
      },
      {
        id: 'l1d',
        title: 'Scenario Practice',
        type: 'scenario',
        scenarios: [
          {
            id: 's1d1',
            setup: 'A woman is browsing the perfume section, picking up bottles and smelling the caps.',
            situation: 'She seems interested but has not asked for help.',
            choices: [
              { text: '"Can I help you find something?"', outcome: 'ok', feedback: 'Standard opener — functional but forgettable. It puts the decision on her. A more specific, observational opener builds more connection.' },
              { text: '"I love watching people discover scents — which fragrance family do you usually wear?"', outcome: 'great', feedback: 'Brilliant. You made a personal connection, showed genuine interest, and opened a diagnostic conversation. She will remember you.' },
              { text: 'Tell her about the current buy-one-get-one promotion.', outcome: 'bad', feedback: 'Too early for promotions. You do not know what she wants yet. Jumping to offers before understanding needs feels pushy and impersonal.' },
            ],
          },
          {
            id: 's1d2',
            setup: 'A man is looking at watches. His wife is waiting nearby, looking impatient.',
            situation: 'He says: "My wife thinks I do not need another watch."',
            choices: [
              { text: 'Laugh and say "Wives always say that!"', outcome: 'bad', feedback: 'Dangerous. You have just excluded the most important person in the room. Never side against a decision-maker — you need her on board.' },
              { text: 'Turn to the wife and ask: "Is there a special occasion coming up? Sometimes a voyage like this marks a perfect milestone."', outcome: 'great', feedback: 'Masterful. You included her, reframed the purchase as meaningful, and created a joint moment. Now she is part of the decision, not against it.' },
              { text: 'Focus on the price saving to justify the purchase.', outcome: 'ok', feedback: 'Price logic rarely wins an emotional objection. The wife is not objecting to the price — she is questioning the need. Address the need first.' },
            ],
          },
          {
            id: 's1d3',
            setup: 'A guest asks for a spirit recommendation as a gift for their father.',
            situation: '"He likes whisky but I do not know much about it. What should I get?"',
            choices: [
              { text: 'Recommend your best-selling bottle immediately.', outcome: 'ok', feedback: 'Efficient but lazy. You know nothing about the father. A better question leads to a better recommendation and a more grateful customer.' },
              { text: 'Ask: "Does he prefer smoky or smooth? Does he usually drink it neat or with ice?" Then recommend based on the answer.', outcome: 'great', feedback: 'Perfect. Two quick questions transform you from a salesperson into an expert advisor. The guest feels guided, not sold to.' },
              { text: 'Show them the gift sets and let them choose.', outcome: 'bad', feedback: 'Presenting options without guidance creates decision paralysis. Guide first, present second.' },
            ],
          },
        ],
      },
    ],
    quiz: [
      { q: 'A gift buyer shopping for spirits needs:', opts: ['The most expensive option', 'Questions about the recipient before a recommendation', 'Your fastest sale to meet targets', 'A discount to commit'], correct: 1, exp: 'Gift buyers respond to personalized guidance, not default recommendations.' },
      { q: 'Which phrase is most effective for cosmetics?', opts: ['"This is on sale today"', '"This is our most popular item"', '"This set is only available onboard"', '"Buy two and save"'], correct: 2, exp: 'Exclusivity — "only available onboard" — is your strongest close in cosmetics.' },
      { q: 'When selling high-ticket jewelry, what do you lead with?', opts: ['The tax saving', 'The price', 'The story, occasion, and meaning', 'The brand name'], correct: 2, exp: 'High-ticket items sell on emotion and story. Price and savings are the bonus, not the hook.' },
      { q: 'A man wants a watch but his wife objects. Your best move is:', opts: ['Side with the husband', 'Focus on the price saving', 'Include the wife and reframe as a meaningful occasion', 'Offer a discount'], correct: 2, exp: 'Include both decision-makers. Reframe the purchase as meaningful rather than justifying it on price.' },
    ],
  },
  {
    id: 2,
    title: 'The Art of the Sale',
    subtitle: 'Advanced techniques — ACES method, upselling, objection handling, and the close',
    icon: '🎯',
    color: '#0f6e56',
    accent: '#9FE1CB',
    lessons: [
      {
        id: 'l2a',
        title: 'The ACES Method',
        type: 'lesson',
        content: {
          headline: 'Every great onboard sale follows the same four-beat rhythm.',
          body: `APPROACH warmly — within 30 seconds of a guest entering, make eye contact, smile, use their name if you know it. Physical proximity with warmth signals readiness without pressure.\n\nCLARIFY needs — ask open questions before pitching anything. "What brings you in today?" / "Shopping for yourself or a gift?" / "Have you bought duty-free before?" Listen more than you speak.\n\nEDUCATE on value — once you know their need, connect a specific product to a specific benefit. Name the price saving. Offer a sample or demonstration. Tell the product's story.\n\nSEAL with confidence — when you sense readiness, guide them gently: "Shall I wrap that up?" / "Would you like the gift bag?" A confident, calm close signals that buying is the natural next step.`,
          visual: 'aces',
          facts: [
            { num: 'A', label: 'Approach — within 30 seconds, warm and genuine' },
            { num: 'C', label: 'Clarify — ask before you pitch, listen before you speak' },
            { num: 'E + S', label: 'Educate then Seal — value first, confident close second' },
          ],
        },
      },
      {
        id: 'l2b',
        title: 'Upselling & Add-On Closes',
        type: 'lesson',
        content: {
          headline: 'The add-on close is the single highest-impact habit you can build.',
          body: `Once a guest commits to a primary purchase, your UPT (Units Per Transaction) clock starts. Always suggest one complementary item:\n\n• Spirits buyer → chocolate pairing or gift bag\n• Perfume buyer → matching body lotion or travel size\n• Watch buyer → cleaning kit or second strap\n• Skincare buyer → SPF add-on ("especially important at sea")\n\nThe key phrase: "While I wrap this up, let me show you something that pairs perfectly with it." This is not aggressive — it is expert curation. The guest who buys two items is not more pressured, they are better served.\n\nAchieving a UPT of 1.8 vs 1.2 can increase your performance score by 40%.`,
          visual: 'upsell',
          facts: [
            { num: '+40%', label: 'Performance score improvement from UPT 1.2 to 1.8' },
            { num: 'One item', label: 'Always suggest exactly one add-on — not two or three' },
            { num: '"Pairs perfectly"', label: 'The phrase that frames add-ons as curation, not pressure' },
          ],
        },
      },
      {
        id: 'l2c',
        title: 'Handling Objections',
        type: 'lesson',
        content: {
          headline: '"I will think about it" is not a no. It is a question in disguise.',
          body: `The four most common objections and how to handle each:\n\n"I need to think about it" → "Of course. Just so you know, we seal the shop when we dock tomorrow and reopen at sea — I would hate for you to miss out on this price."\n\n"It is too expensive" → "I completely understand. This is actually [X]% less than the same product in [their home country]. Would a smaller size work for you?"\n\n"I do not really drink / wear perfume" → "No problem at all — do you have someone at home who does? This makes an incredible gift at this price."\n\n"I will come back later" → "Absolutely. I will be here. Can I write down the product name so you remember exactly which one?"\n\nNotice the pattern: acknowledge, reframe, offer an alternative path forward.`,
          visual: 'objection',
          facts: [
            { num: 'Acknowledge', label: 'Never argue with an objection — validate it first' },
            { num: 'Reframe', label: 'Then offer a new perspective or alternative' },
            { num: 'Path forward', label: 'Always give the guest a next step, never a dead end' },
          ],
        },
      },
      {
        id: 'l2d',
        title: 'Scenario Practice',
        type: 'scenario',
        scenarios: [
          {
            id: 's2d1',
            setup: 'A guest has just agreed to buy a bottle of Hennessy VS.',
            situation: 'You are at the register. There is a chocolate gift set on the counter nearby.',
            choices: [
              { text: 'Process the sale quickly and efficiently.', outcome: 'bad', feedback: 'You left money on the table and the guest less well served. The add-on moment is after commitment, not before — this was the perfect window.' },
              { text: '"While I pack this up, let me show you something that pairs perfectly — a lot of guests gift these together and it makes the presentation incredible."', outcome: 'great', feedback: 'Textbook add-on close. You framed it as curation ("pairs perfectly"), social proof ("a lot of guests"), and benefit ("incredible presentation"). Natural, not pushy.' },
              { text: '"Would you like to add anything else?"', outcome: 'ok', feedback: 'Better than nothing, but vague. Specific suggestions convert far better than open questions. Show, do not ask.' },
            ],
          },
          {
            id: 's2d2',
            setup: 'A guest says: "This perfume is lovely but $95 feels like a lot."',
            situation: 'She is holding the bottle and clearly attracted to it.',
            choices: [
              { text: 'Offer a 10% discount.', outcome: 'bad', feedback: 'Discounting without authorization damages margins and trains guests to always negotiate. Use the duty-free saving — it is the discount that already exists.' },
              { text: '"I completely understand. Back in the UK this retails at £110 — you are already saving £25 just by being onboard. That is the duty-free difference working for you."', outcome: 'great', feedback: 'You validated the feeling, then reframed $95 as a bargain by anchoring to home retail. No discount needed — the math did the work.' },
              { text: 'Show her a cheaper alternative.', outcome: 'ok', feedback: 'Downselling is sometimes right, but she is holding the bottle she loves. Try reframing value before abandoning the sale.' },
            ],
          },
          {
            id: 's2d3',
            setup: 'A guest says "I will come back later" and starts walking toward the door.',
            situation: 'He was looking at a watch for 10 minutes.',
            choices: [
              { text: 'Say "Of course, see you later!" and let him go.', outcome: 'bad', feedback: '"I will come back" is almost always a soft no. He will not come back unless you give him a reason to. You needed one more move.' },
              { text: '"Absolutely — can I write down the reference number for you? And just so you know, we close the shop when we dock at Nassau tomorrow morning."', outcome: 'great', feedback: 'Two moves: practical help (reference number) and gentle urgency (port closing). Neither is pressure — both are genuine service.' },
              { text: 'Ask him why he is hesitating.', outcome: 'ok', feedback: 'Direct but risky — asking "why" can feel confrontational. Offering practical help and soft urgency achieves the same result with less friction.' },
            ],
          },
        ],
      },
    ],
    quiz: [
      { q: 'What does the E in ACES stand for?', opts: ['Engage', 'Educate', 'Evaluate', 'Explain'], correct: 1, exp: 'Educate — connect a specific product to a specific benefit once you know the guest\'s need.' },
      { q: 'A guest says "I will think about it." Your best response includes:', opts: ['Offering a discount', 'Letting them leave without comment', 'Soft urgency about port timing and a helpful next step', 'Asking why they are hesitating'], correct: 2, exp: 'Soft urgency (shop closes in port) plus a practical gesture (write down the reference) converts hesitation to action.' },
      { q: 'When is the best time to suggest an add-on?', opts: ['At the start of the conversation', 'After the guest commits to a primary purchase', 'Only if the guest asks', 'Never — it feels pushy'], correct: 1, exp: 'After commitment is the ideal moment — the guest is already in buying mode and receptive.' },
      { q: 'A guest says the price is too high. You should:', opts: ['Offer a discount immediately', 'Show a cheaper product', 'Anchor to home-country retail price to show the duty-free saving', 'Agree and move on'], correct: 2, exp: 'The duty-free saving IS the discount. Use it before creating margin problems with unauthorized reductions.' },
    ],
  },
  {
    id: 3,
    title: 'Rules, Compliance & Customs',
    subtitle: 'The regulations that protect you, the guest, and the ship — non-negotiable',
    icon: '⚖️',
    color: '#7c3aed',
    accent: '#c4b5fd',
    lessons: [
      {
        id: 'l3a',
        title: 'Age Verification',
        type: 'lesson',
        content: {
          headline: 'Zero tolerance. No exceptions. Ever.',
          body: `Selling alcohol or tobacco to a minor is a criminal offence in international maritime law. The consequences — for you personally, for the ship, and for SelectiveCrew — are severe.\n\nThe rules:\n• Minimum age is 18+ in international waters for most cruise lines\n• 21+ applies when the vessel departs or returns to a US port\n• If you are uncertain, ask. Always. There is no such thing as "they looked old enough."\n• When a guest cannot produce valid photo ID, the sale ends. Politely. Firmly. Finally.\n\nThe script: "I appreciate your understanding — I am required to ask for ID for all alcohol purchases. If you do not have it with you, I am unable to complete this sale. I hope you understand."`,
          visual: 'age',
          facts: [
            { num: '18+', label: 'Minimum age for alcohol in international waters' },
            { num: '21+', label: 'Required for voyages departing or arriving at US ports' },
            { num: 'Zero', label: 'Exceptions — no ID, no sale, no compromise' },
          ],
        },
      },
      {
        id: 'l3b',
        title: 'Customs Allowances',
        type: 'lesson',
        content: {
          headline: 'Know your guest\'s destination limits. This is how you become indispensable.',
          body: `Guests who arrive home with more than their duty-free allowance face seizure and fines. When you help them plan within their limits, you become a trusted advisor — not just a salesperson.\n\nKey allowances to memorize:\n• United States: $800 per person, 1 liter of spirits\n• European Union: €430 per person, 1 liter of spirits (40%+ ABV)\n• United Kingdom: £390 per person, 1 liter of spirits\n• Canada: CAD $800 per person, 1.14 liters of spirits\n• Australia: AUD $900 per person, 2.25 liters of alcohol\n\nThe script: "Where are you heading after the cruise? I want to make sure you get maximum value within your customs allowance."`,
          visual: 'customs',
          facts: [
            { num: '$800', label: 'US duty-free allowance per person' },
            { num: '1 liter', label: 'Spirit allowance for US, EU, and UK arrivals' },
            { num: 'AUD $900', label: 'Australian allowance — one of the most generous' },
          ],
        },
      },
      {
        id: 'l3c',
        title: 'Port Rules & Sealed Bags',
        type: 'lesson',
        content: {
          headline: 'The shop seals in port. The bag seals at purchase. Neither is negotiable.',
          body: `Duty-free status only applies when the ship is at sea or docked at a designated free port. When docked at a regular commercial port, the shop must be completely sealed. Your supervisor signals open and close times — never assume.\n\nAll alcohol and tobacco must be sold in tamper-evident sealed bags with the receipt attached. Guests may not open these purchases until they clear customs at their final destination. Explain this proactively at the point of sale — it prevents complaints and confusion later.\n\nIf a guest opens the bag before clearing customs and the product is confiscated, they cannot claim a refund. This is why the explanation matters.`,
          visual: 'port',
          facts: [
            { num: 'Sealed', label: 'Shop must close completely during regular port calls' },
            { num: 'Tamper bag', label: 'All alcohol and tobacco sold in sealed bags — no exceptions' },
            { num: 'Customs first', label: 'Guests cannot open duty-free purchases until clearing customs' },
          ],
        },
      },
      {
        id: 'l3d',
        title: 'Scenario Practice',
        type: 'scenario',
        scenarios: [
          {
            id: 's3d1',
            setup: 'A group of four young adults wants to buy alcohol. They look around 20 years old. The ship departed from Miami.',
            situation: 'One of them says "We are all 21, do not worry about it."',
            choices: [
              { text: 'They look old enough — process the sale.', outcome: 'bad', feedback: 'Critical error. The ship departed from a US port, so the age requirement is 21+. "They look old enough" is never a legal defence. You need ID from every person purchasing.' },
              { text: '"I appreciate that — I still need to see valid ID from each of you before I can process any alcohol purchases. It is required for all guests on this voyage."', outcome: 'great', feedback: 'Perfect. Calm, firm, non-judgmental. You applied the US port rule correctly and did not single anyone out. This is professional compliance.' },
              { text: 'Ask one of them for ID and if they have it, sell to the group.', outcome: 'bad', feedback: 'Each purchaser needs their own ID. One person\'s ID does not cover a group purchase. This could still result in a sale to a minor.' },
            ],
          },
          {
            id: 's3d2',
            setup: 'The ship has just docked at Nassau, Bahamas — a regular commercial port.',
            situation: 'A guest approaches and asks to buy two bottles of rum.',
            choices: [
              { text: 'Process the sale quickly before the supervisor notices.', outcome: 'bad', feedback: 'This is a serious compliance violation. Selling duty-free goods in a regular port could result in immediate termination and legal consequences for you and the ship.' },
              { text: 'Explain the shop is sealed while docked and invite them to return once at sea.', outcome: 'great', feedback: 'Correct and professional. Explain warmly, give a time ("we reopen tomorrow morning once we leave port"), and they will return. A refusal handled well becomes a future sale.' },
              { text: 'Tell them to come back in an hour.', outcome: 'ok', feedback: 'Closer, but vague. Be specific — explain why (port regulations), and give a concrete time frame so they actually return.' },
            ],
          },
          {
            id: 's3d3',
            setup: 'A US-bound guest wants to buy 3 bottles of whisky and 2 bottles of wine.',
            situation: '"I want all five — they are gifts for my family."',
            choices: [
              { text: 'Sell all five — customs is their problem, not yours.', outcome: 'bad', feedback: 'Wrong attitude and wrong outcome. If their goods are seized at customs, they blame you and the ship. A trusted advisor prevents this problem, not causes it.' },
              { text: 'Explain the US 1-liter spirits limit and help them choose the most valuable combination within the allowance.', outcome: 'great', feedback: 'This is the mark of a true advisor. You protected the guest from a customs problem, maximized the value of what they can take, and built lasting trust.' },
              { text: 'Suggest they split the purchase between family members to stay within limits.', outcome: 'ok', feedback: 'Creative, but the 1-liter limit applies per person — they would need each family member present and purchasing separately. Make sure you know the rule precisely.' },
            ],
          },
        ],
      },
    ],
    quiz: [
      { q: 'What is the minimum drinking age when a ship departs from a US port?', opts: ['18', '19', '20', '21'], correct: 3, exp: '21+ applies for all voyages departing or returning to US ports, regardless of the guest\'s nationality.' },
      { q: 'A guest cannot show ID for an alcohol purchase. You:', opts: ['Sell it — they look old enough', 'Ask a colleague to decide', 'Decline the sale politely and explain the policy', 'Offer a non-alcoholic alternative instead'], correct: 2, exp: 'No ID, no sale. The script: acknowledge, explain the requirement, decline firmly and warmly.' },
      { q: 'What is the US duty-free spirits allowance per person?', opts: ['500ml', '1 liter', '1.5 liters', '2 liters'], correct: 1, exp: '1 liter of spirits plus $800 total goods value per person for US arrivals.' },
      { q: 'When can duty-free goods be sold?', opts: ['Any time the shop is open', 'Only when the ship is at sea or at a designated free port', 'Whenever the supervisor approves', 'Only between 10am and 10pm'], correct: 1, exp: 'Duty-free sales are only legal at sea or at designated free ports — not during regular port calls.' },
    ],
  },
  {
    id: 4,
    title: 'Final Certification',
    subtitle: 'Demonstrate your mastery across all four modules — score 80% to earn your certificate',
    icon: '🏆',
    color: '#c9a84c',
    accent: '#0a1628',
    lessons: [],
    quiz: [
      { q: 'A guest enters the shop and says "I am just browsing." Your opening move is:', opts: ['Leave them completely alone', '"What brings you in today — shopping for yourself or a gift?"', '"We have some great promotions today!"', '"Let me know if you need anything."'], correct: 1, exp: 'An open, curious question converts browsers into buyers by starting a diagnostic conversation.' },
      { q: 'Which fragrance close is most effective?', opts: ['"This one is on sale"', '"This is very popular"', '"This set is only available onboard — you cannot get it at home"', '"This would suit you perfectly"'], correct: 2, exp: 'Exclusivity — "only available onboard" — is the strongest close in cosmetics and perfume.' },
      { q: 'You notice a guest checking the price of a whisky and putting it back. You say:', opts: ['"That is our most popular bottle"', '"I noticed you checked the price — that one is actually 28% cheaper here than duty-paid retail"', '"We have cheaper options over here"', '"Can I help you find something?"'], correct: 1, exp: 'Specific savings on specific products convert price hesitation into purchase momentum.' },
      { q: 'The ACES method stands for:', opts: ['Approach, Connect, Educate, Sell', 'Approach, Clarify, Educate, Seal', 'Attract, Clarify, Engage, Sell', 'Approach, Confirm, Educate, Seal'], correct: 1, exp: 'Approach, Clarify, Educate, Seal — the four beats of every successful onboard sale.' },
      { q: 'A US-bound guest wants 3 liters of spirits. What do you advise?', opts: ['Sell it all — customs is not your problem', 'Explain the 1-liter US limit and help them choose the best combination', 'Refuse the sale entirely', 'Tell them to declare it all at customs'], correct: 1, exp: 'A trusted advisor helps guests maximize value within their allowance. This builds loyalty and prevents customs problems.' },
      { q: 'After a guest commits to a perfume purchase, you say:', opts: ['"Great, shall I process that?"', '"Would you like anything else?"', '"While I wrap this up, let me show you the matching body lotion — it completes the set beautifully."', '"Do you have a loyalty card?"'], correct: 2, exp: 'Specific add-on with a benefit ("completes the set") after commitment is the highest-converting approach.' },
      { q: 'A guest says "It is too expensive." You respond:', opts: ['"I can give you 10% off"', '"We have cheaper options"', '"I understand — in London this retails at £120, so you are saving £35 just by being here"', '"It is worth every penny"'], correct: 2, exp: 'Anchor to home retail price — the duty-free saving IS the discount. No margin damage, full value preserved.' },
      { q: 'The shop is docked at a regular port. A guest asks to buy rum. You:', opts: ['Sell it quickly', 'Explain the shop is sealed during port calls and invite them back at sea', 'Tell them to ask tomorrow', 'Check with your supervisor before answering'], correct: 1, exp: 'Duty-free sales in regular ports are illegal. Explain warmly, give a specific reopening time, convert the refusal into a future sale.' },
    ],
  },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function CoursePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [moduleScores, setModuleScores] = useState({});
  const [moduleUnlocked, setModuleUnlocked] = useState([true, false, false, false, false]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [scenarioAnswers, setScenarioAnswers] = useState({});
  const [certData, setCertData] = useState(null);
  const [candName, setCandName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { router.push('/training'); return; }
      setUser(u);
      setCandName(u.displayName || '');
      setLoading(false);
    });
    return unsub;
  }, []);

  function scrollTop() {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Module completion check
  function isModuleComplete(modIdx) {
    const score = moduleScores[modIdx];
    return score !== undefined && score >= 80;
  }

  // Quiz logic
  function getQuizKey(modIdx) { return `quiz_${modIdx}`; }
  function getQuizAnswers(modIdx) { return quizAnswers[getQuizKey(modIdx)] || {}; }

  function answerQuiz(modIdx, qi, oi) {
    const key = getQuizKey(modIdx);
    const existing = quizAnswers[key] || {};
    if (existing[qi] !== undefined) return;
    const updated = { ...existing, [qi]: oi };
    setQuizAnswers(prev => ({ ...prev, [key]: updated }));

    const mod = MODULES[modIdx];
    if (Object.keys(updated).length === mod.quiz.length) {
      const correct = mod.quiz.filter((q, i) => updated[i] === q.correct).length;
      const score = Math.round((correct / mod.quiz.length) * 100);
      setModuleScores(prev => ({ ...prev, [modIdx]: score }));
      if (score >= 80) {
        const nextIdx = modIdx + 1;
        if (nextIdx < MODULES.length) {
          setModuleUnlocked(prev => {
            const n = [...prev]; n[nextIdx] = true; return n;
          });
        }
        if (user) completeModule(user.uid, modIdx);
        if (modIdx === 4 && user) saveQuizResult(user.uid, correct, mod.quiz.length);
      }
    }
  }

  // Scenario logic
  function answerScenario(scenId, choiceIdx) {
    setScenarioAnswers(prev => ({ ...prev, [scenId]: choiceIdx }));
  }

  // Certificate
  async function generateCert() {
    if (!candName.trim()) { alert('Please enter your full name.'); return; }
    setGenerating(true);
    try {
      const finalMod = MODULES[4];
      const answers = getQuizAnswers(4);
      const score = finalMod.quiz.filter((q, i) => answers[i] === q.correct).length;
      const certId = user ? await issueCertificate(user.uid, candName, score, finalMod.quiz.length) : `SC-DF-${Date.now()}`;
      setCertData({ certId, name: candName, score, total: finalMod.quiz.length, pct: Math.round(score / finalMod.quiz.length * 100), date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) });
    } finally { setGenerating(false); }
  }

  function printCert() {
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><title>Certificate — ${certData.name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;background:#f5f4f0;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}.wrap{background:#0a1628;padding:8px;max-width:780px;width:100%;border-radius:4px}.inner{background:#fff;border:2px solid #c9a84c;padding:48px 40px;position:relative;text-align:center}.c{position:absolute;width:40px;height:40px;border-color:#c9a84c;border-style:solid}.tl{top:12px;left:12px;border-width:2px 0 0 2px}.tr{top:12px;right:12px;border-width:2px 2px 0 0}.bl{bottom:12px;left:12px;border-width:0 0 2px 2px}.br{bottom:12px;right:12px;border-width:0 2px 2px 0}.seal{width:76px;height:76px;border-radius:50%;background:#0a1628;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 18px}.st{font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:#c9a84c;line-height:1.4;text-align:center}.logo{font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#5a6478;margin-bottom:8px}.logo span{color:#c9a84c;font-weight:600}.div{width:60px;height:1px;background:#c9a84c;margin:10px auto}.issued{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#5a6478;margin-bottom:14px}.headline{font-family:'Playfair Display',serif;font-size:26px;font-weight:600;color:#0a1628;margin-bottom:18px}.to{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#5a6478;margin-bottom:8px}.cname{font-family:'Playfair Display',serif;font-size:30px;font-style:italic;color:#0a1628;border-bottom:1px solid #eee;padding-bottom:12px;margin-bottom:18px}.body{font-size:13px;color:#5a6478;line-height:1.65;max-width:440px;margin:0 auto 18px}.score{display:inline-block;padding:8px 24px;background:#fef9ed;border:1px solid #c9a84c;border-radius:30px;font-size:13px;font-weight:500;color:#856a1a;margin-bottom:20px}.db{background:#fff8e1;border:1px solid #e8d5a0;border-radius:8px;padding:14px 18px;margin:16px 0;text-align:left}.dl{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#c9a84c;margin-bottom:6px}.dp{font-size:11px;color:#6b5515;line-height:1.6}.sigs{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px}.sig{text-align:center}.sl{height:1px;background:#eee;margin-bottom:8px}.sn{font-size:12px;font-weight:500;color:#0a1628}.sr{font-size:11px;color:#5a6478}.cid{font-size:10px;color:#ccc;margin-top:14px}@media print{body{background:white;padding:0}}</style></head>
    <body><div class="wrap"><div class="inner"><div class="c tl"></div><div class="c tr"></div><div class="c bl"></div><div class="c br"></div>
    <div class="seal"><div class="st">SELECTIVE<br>CREW<br>CERTIFIED</div></div>
    <div class="logo">Selective<span>Crew</span> Training Institute</div><div class="div"></div>
    <div class="issued">Certificate of Completion</div>
    <div class="headline">Duty-Free Sales Excellence<br>for Cruise Ship Applicants</div>
    <div class="to">Proudly awarded to</div><div class="cname">${certData.name}</div>
    <div class="body">Having successfully completed all four modules of the SelectiveCrew Duty-Free Sales Excellence programme, demonstrating mastery of onboard retail, product knowledge, sales techniques, and maritime compliance.</div>
    <div class="score">Final Score: ${certData.score}/${certData.total} (${certData.pct}%) · ${certData.date}</div>
    <div class="db"><div class="dl">Employment Disclaimer</div><div class="dp">This certificate confirms training completion only. It does NOT constitute a job offer or guarantee of employment. Placement depends on English proficiency, personality, character, professional conduct, and interview performance — all assessed independently by SelectiveCrew.</div></div>
    <div class="sigs"><div class="sig"><div class="sl"></div><div class="sn">SelectiveCrew</div><div class="sr">Training Department</div></div><div class="sig"><div class="sl"></div><div class="sn">${certData.name}</div><div class="sr">Candidate</div></div></div>
    <div class="cid">Certificate ID: ${certData.certId} · selectivecrew.com/verify?id=${certData.certId}</div>
    </div></div></body></html>`);
    w.document.close(); setTimeout(() => w.print(), 800);
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a1628' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid rgba(201,168,76,0.3)', borderTop: '3px solid #c9a84c', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'sans-serif' }}>Loading your training...</p>
      </div>
    </div>
  );

  const mod = MODULES[activeModule];
  const totalLessons = mod.lessons.length;
  const currentLesson = mod.lessons[activeLesson];
  const isLastLesson = activeLesson === totalLessons;
  const modScore = moduleScores[activeModule];
  const quizAnswersForMod = getQuizAnswers(activeModule);
  const quizComplete = Object.keys(quizAnswersForMod).length === mod.quiz.length;
  const overallProgress = Math.round((Object.keys(moduleScores).filter(k => moduleScores[k] >= 80).length / MODULES.length) * 100);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#f0f2f5', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 2px; }
        button { cursor: pointer; font-family: inherit; }
        .lesson-animate { animation: fadeIn 0.4s ease; }
        .nav-item:hover { background: rgba(255,255,255,0.08) !important; }
        .choice-btn:hover:not(:disabled) { transform: translateY(-1px); border-color: #0a1628 !important; }
        .fact-card { transition: transform 0.2s; } .fact-card:hover { transform: translateY(-2px); }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{ width: sidebarOpen ? 300 : 0, minWidth: sidebarOpen ? 300 : 0, background: '#0a1628', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'all 0.3s ease', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: '#fff', marginBottom: 4 }}>
            Selective<span style={{ color: '#c9a84c' }}>Crew</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase' }}>Duty-Free Sales Excellence</div>
          {/* Overall progress */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Overall progress</span>
              <span style={{ fontSize: 11, color: '#c9a84c', fontWeight: 600 }}>{overallProgress}%</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, #c9a84c, #e8d5a0)', borderRadius: 2, width: overallProgress + '%', transition: 'width 0.6s ease' }}></div>
            </div>
          </div>
        </div>

        {/* Module nav */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {MODULES.map((m, mi) => {
            const unlocked = moduleUnlocked[mi];
            const complete = isModuleComplete(mi);
            const active = activeModule === mi;
            return (
              <div key={mi}>
                <button onClick={() => { if (unlocked) { setActiveModule(mi); setActiveLesson(0); scrollTop(); } }}
                  className="nav-item"
                  style={{ width: '100%', padding: '12px 24px', background: active ? 'rgba(201,168,76,0.12)' : 'transparent', border: 'none', borderLeft: active ? '3px solid #c9a84c' : '3px solid transparent', display: 'flex', alignItems: 'center', gap: 12, opacity: unlocked ? 1 : 0.4, cursor: unlocked ? 'pointer' : 'not-allowed', transition: 'all 0.2s', textAlign: 'left' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: complete ? '#1D9E75' : active ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                    {complete ? '✓' : unlocked ? m.icon : '🔒'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: active ? '#c9a84c' : '#fff', marginBottom: 2 }}>Module {mi + 1}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                  </div>
                  {complete && <div style={{ fontSize: 10, color: '#1D9E75', fontWeight: 600 }}>PASSED</div>}
                  {moduleScores[mi] !== undefined && !complete && <div style={{ fontSize: 10, color: '#e24b4a', fontWeight: 600 }}>{moduleScores[mi]}%</div>}
                </button>
                {active && m.lessons.length > 0 && (
                  <div style={{ padding: '4px 0 4px 59px' }}>
                    {m.lessons.map((l, li) => (
                      <button key={li} onClick={() => { setActiveLesson(li); scrollTop(); }}
                        style={{ width: '100%', padding: '6px 16px 6px 0', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, opacity: 0.7 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: activeLesson === li ? '#c9a84c' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}></div>
                        <span style={{ fontSize: 11, color: activeLesson === li ? '#c9a84c' : 'rgba(255,255,255,0.5)', textAlign: 'left', lineHeight: 1.4 }}>{l.title}</span>
                      </button>
                    ))}
                    <button onClick={() => { setActiveLesson(m.lessons.length); scrollTop(); }}
                      style={{ width: '100%', padding: '6px 16px 6px 0', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, opacity: 0.7 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: activeLesson === m.lessons.length ? '#c9a84c' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}></div>
                      <span style={{ fontSize: 11, color: activeLesson === m.lessons.length ? '#c9a84c' : 'rgba(255,255,255,0.5)', textAlign: 'left' }}>Module Quiz</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User info */}
        <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#c9a84c', fontWeight: 600, flexShrink: 0 }}>
            {(user?.displayName || user?.email || '?')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: '#fff', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.displayName || 'Candidate'}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
          </div>
          <button onClick={() => signOut(auth).then(() => router.push('/training'))}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 11, padding: '4px 8px', borderRadius: 4 }}>
            Exit
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e8eef8', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, height: 56, flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(s => !s)}
            style={{ background: 'none', border: 'none', color: '#5a6478', fontSize: 18, padding: '4px 8px', borderRadius: 6 }}>
            ☰
          </button>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, color: '#5a6478' }}>Module {activeModule + 1} · </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0a1628' }}>{mod.title}</span>
          </div>
          <div style={{ display: 'flex', align: 'center', gap: 8 }}>
            <div style={{ background: '#fff8e1', border: '1px solid #e8d5a0', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#856a1a', fontWeight: 500 }}>
              {overallProgress}% complete
            </div>
          </div>
        </div>

        {/* Disclaimer bar */}
        <div style={{ background: '#fff8e1', borderBottom: '1px solid #e8d5a0', padding: '8px 24px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13 }}>⚠️</span>
          <span style={{ fontSize: 12, color: '#6b5515' }}><strong>Reminder:</strong> Completing this course does not guarantee employment. Placement depends on personality, character, English level, and other factors assessed independently by SelectiveCrew.</span>
        </div>

        {/* Scrollable content */}
        <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '32px 40px 60px' }}>

          {/* MODULE INTRO (lesson 0 of final module) */}
          {activeModule === 4 && activeLesson === 0 && (
            <FinalModule
              mod={mod} quizAnswers={quizAnswersForMod} quizComplete={quizComplete}
              modScore={modScore} answerQuiz={answerQuiz} certData={certData}
              candName={candName} setCandName={setCandName} generating={generating}
              generateCert={generateCert} printCert={printCert}
              allModulesComplete={[0,1,2,3].every(i => isModuleComplete(i))}
            />
          )}

          {/* REGULAR MODULE LESSON */}
          {activeModule < 4 && currentLesson && !isLastLesson && (
            <div className="lesson-animate">
              {currentLesson.type === 'lesson' && (
                <LessonView lesson={currentLesson} onNext={() => { setActiveLesson(l => l + 1); scrollTop(); }} />
              )}
              {currentLesson.type === 'scenario' && (
                <ScenarioView lesson={currentLesson} scenarioAnswers={scenarioAnswers} answerScenario={answerScenario}
                  onNext={() => { setActiveLesson(l => l + 1); scrollTop(); }} />
              )}
            </div>
          )}

          {/* MODULE QUIZ */}
          {activeModule < 4 && isLastLesson && (
            <div className="lesson-animate">
              <QuizView mod={mod} modIdx={activeModule} quizAnswers={quizAnswersForMod}
                quizComplete={quizComplete} modScore={modScore} answerQuiz={answerQuiz}
                onNextModule={() => { setActiveModule(m => m + 1); setActiveLesson(0); scrollTop(); }}
                nextUnlocked={moduleUnlocked[activeModule + 1]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── LESSON VIEW ─────────────────────────────────────────────────────────────
function LessonView({ lesson, onNext }) {
  const { content } = lesson;
  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 600, color: '#0a1628', marginBottom: 10, lineHeight: 1.25 }}>{lesson.title}</h1>
        <p style={{ fontSize: 15, color: '#c9a84c', fontWeight: 500, fontStyle: 'italic' }}>{content.headline}</p>
      </div>

      {/* Visual illustration */}
      <VisualIllustration type={content.visual} />

      {/* Body text */}
      <div style={{ marginBottom: 28 }}>
        {content.body.split('\n\n').map((para, i) => (
          <p key={i} style={{ fontSize: 15, color: '#2c3e50', lineHeight: 1.8, marginBottom: 16 }}>{para}</p>
        ))}
      </div>

      {/* Fact cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 36 }}>
        {content.facts.map((f, i) => (
          <div key={i} className="fact-card" style={{ background: '#fff', border: '1px solid #e8eef8', borderRadius: 12, padding: '16px 18px', borderLeft: '4px solid #c9a84c' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: '#0a1628', marginBottom: 4 }}>{f.num}</div>
            <div style={{ fontSize: 12, color: '#5a6478', lineHeight: 1.5 }}>{f.label}</div>
          </div>
        ))}
      </div>

      <button onClick={onNext} style={{ background: '#0a1628', color: '#c9a84c', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
        Continue to next lesson →
      </button>
    </div>
  );
}

// ─── SCENARIO VIEW ────────────────────────────────────────────────────────────
function ScenarioView({ lesson, scenarioAnswers, answerScenario, onNext }) {
  const allAnswered = lesson.scenarios.every(s => scenarioAnswers[s.id] !== undefined);
  const totalCorrect = lesson.scenarios.filter(s => {
    const ans = scenarioAnswers[s.id];
    return ans !== undefined && s.choices[ans].outcome === 'great';
  }).length;

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff8e1', border: '1px solid #e8d5a0', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: '#856a1a', fontWeight: 500, marginBottom: 14 }}>
          Real-World Scenarios
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: '#0a1628', marginBottom: 8 }}>Put It Into Practice</h1>
        <p style={{ fontSize: 14, color: '#5a6478' }}>Choose the best response for each situation. There is one ideal answer per scenario.</p>
      </div>

      {lesson.scenarios.map((scenario, si) => {
        const chosen = scenarioAnswers[scenario.id];
        const answered = chosen !== undefined;
        return (
          <div key={scenario.id} style={{ background: '#fff', border: '1px solid #e8eef8', borderRadius: 16, overflow: 'hidden', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            {/* Scenario header */}
            <div style={{ background: '#0a1628', padding: '14px 20px' }}>
              <div style={{ fontSize: 11, color: '#c9a84c', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Scenario {si + 1}</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{scenario.setup}</p>
            </div>
            {/* Guest dialogue */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f8', background: '#f8faff' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e8eef8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>👤</div>
                <div>
                  <div style={{ fontSize: 11, color: '#5a6478', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Guest says</div>
                  <p style={{ fontSize: 14, color: '#0a1628', fontStyle: 'italic', lineHeight: 1.5 }}>"{scenario.situation}"</p>
                </div>
              </div>
            </div>
            {/* Choices */}
            <div style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: 12, color: '#5a6478', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Your response:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {scenario.choices.map((choice, ci) => {
                  const isChosen = chosen === ci;
                  const isAnswered = answered;
                  const outcome = choice.outcome;
                  let bg = '#f8faff', border = '#e8eef8', color = '#0a1628';
                  if (isAnswered && isChosen) {
                    if (outcome === 'great') { bg = '#eaf3de'; border = '#639922'; color = '#27500a'; }
                    else if (outcome === 'bad') { bg = '#fcebeb'; border = '#e24b4a'; color = '#501313'; }
                    else { bg = '#fff8e1'; border = '#e8d5a0'; color = '#856a1a'; }
                  } else if (isAnswered && outcome === 'great') {
                    bg = '#f0faf5'; border = '#639922'; color = '#27500a';
                  }
                  return (
                    <div key={ci}>
                      <button className="choice-btn" disabled={isAnswered} onClick={() => answerScenario(scenario.id, ci)}
                        style={{ width: '100%', padding: '12px 16px', background: bg, border: `1.5px solid ${border}`, borderRadius: 10, fontSize: 13, color, textAlign: 'left', lineHeight: 1.5, transition: 'all 0.2s', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ width: 22, height: 22, borderRadius: '50%', background: isAnswered && isChosen ? (outcome === 'great' ? '#639922' : outcome === 'bad' ? '#e24b4a' : '#e8d5a0') : '#e8eef8', color: isAnswered && isChosen ? '#fff' : '#5a6478', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                          {isAnswered && isChosen ? (outcome === 'great' ? '✓' : outcome === 'bad' ? '✕' : '~') : String.fromCharCode(65 + ci)}
                        </span>
                        {choice.text}
                      </button>
                      {isAnswered && isChosen && (
                        <div style={{ marginTop: 8, padding: '10px 14px', background: outcome === 'great' ? '#eaf3de' : outcome === 'bad' ? '#fcebeb' : '#fff8e1', borderRadius: 8, fontSize: 13, color: outcome === 'great' ? '#27500a' : outcome === 'bad' ? '#501313' : '#856a1a', lineHeight: 1.55, border: `1px solid ${outcome === 'great' ? '#639922' : outcome === 'bad' ? '#e24b4a' : '#e8d5a0'}` }}>
                          <strong>{outcome === 'great' ? 'Excellent:' : outcome === 'bad' ? 'Missed opportunity:' : 'Acceptable:'}</strong> {choice.feedback}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {allAnswered && (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          <div style={{ background: totalCorrect === lesson.scenarios.length ? '#eaf3de' : '#fff8e1', border: `1px solid ${totalCorrect === lesson.scenarios.length ? '#639922' : '#e8d5a0'}`, borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 28 }}>{totalCorrect === lesson.scenarios.length ? '🎯' : '💡'}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#0a1628', marginBottom: 2 }}>
                {totalCorrect}/{lesson.scenarios.length} ideal responses
              </div>
              <div style={{ fontSize: 13, color: '#5a6478' }}>
                {totalCorrect === lesson.scenarios.length ? 'Perfect! You handled every situation with confidence.' : 'Review the feedback above — these techniques take practice to master.'}
              </div>
            </div>
          </div>
          <button onClick={onNext} style={{ background: '#0a1628', color: '#c9a84c', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 600 }}>
            Continue to Module Quiz →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── QUIZ VIEW ────────────────────────────────────────────────────────────────
function QuizView({ mod, modIdx, quizAnswers, quizComplete, modScore, answerQuiz, onNextModule, nextUnlocked }) {
  const passed = modScore !== undefined && modScore >= 80;
  const failed = modScore !== undefined && modScore < 80;
  const correct = mod.quiz.filter((q, i) => quizAnswers[i] === q.correct).length;

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0e8ff', border: '1px solid #c4b5fd', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: '#7c3aed', fontWeight: 500, marginBottom: 14 }}>
          Module Quiz — Score 80% to unlock next module
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: '#0a1628', marginBottom: 8 }}>Test Your Knowledge</h1>
        <p style={{ fontSize: 14, color: '#5a6478' }}>{mod.quiz.length} questions · You need {Math.ceil(mod.quiz.length * 0.8)}/{mod.quiz.length} correct to pass</p>
      </div>

      {mod.quiz.map((q, qi) => {
        const ans = quizAnswers[qi];
        const answered = ans !== undefined;
        return (
          <div key={qi} style={{ background: '#fff', border: '1px solid #e8eef8', borderRadius: 14, padding: '20px 24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: 11, color: '#5a6478', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Question {qi + 1}</div>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#0a1628', marginBottom: 16, lineHeight: 1.5 }}>{q.q}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.opts.map((opt, oi) => {
                let bg = '#f8faff', border = '#e8eef8', color = '#0a1628';
                if (answered) {
                  if (oi === q.correct) { bg = '#eaf3de'; border = '#639922'; color = '#27500a'; }
                  else if (oi === ans && oi !== q.correct) { bg = '#fcebeb'; border = '#e24b4a'; color = '#501313'; }
                }
                return (
                  <button key={oi} disabled={answered} onClick={() => answerQuiz(modIdx, qi, oi)}
                    style={{ padding: '11px 16px', background: bg, border: `1.5px solid ${border}`, borderRadius: 8, fontSize: 13, color, textAlign: 'left', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: answered && oi === q.correct ? '#639922' : answered && oi === ans ? '#e24b4a' : '#e8eef8', color: answered && (oi === q.correct || oi === ans) ? '#fff' : '#5a6478', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {answered && oi === q.correct ? '✓' : answered && oi === ans ? '✕' : String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: ans === q.correct ? '#eaf3de' : '#f8faff', borderRadius: 8, fontSize: 13, color: '#5a6478', lineHeight: 1.5, border: '1px solid #e8eef8' }}>
                <strong style={{ color: '#0a1628' }}>Why:</strong> {q.exp}
              </div>
            )}
          </div>
        );
      })}

      {quizComplete && (
        <div style={{ animation: 'fadeIn 0.5s ease', marginTop: 8 }}>
          <div style={{ background: passed ? 'linear-gradient(135deg, #0a1628, #1a3a5c)' : '#fff', border: passed ? 'none' : '1px solid #e8eef8', borderRadius: 16, padding: '24px 28px', marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{passed ? '🎉' : '📚'}</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: passed ? '#f8f4ec' : '#0a1628', marginBottom: 8 }}>
              {passed ? 'Module Passed!' : 'Not Quite There'}
            </h2>
            <p style={{ fontSize: 14, color: passed ? 'rgba(248,244,236,0.7)' : '#5a6478', marginBottom: 16 }}>
              {passed ? `You scored ${correct}/${mod.quiz.length} (${modScore}%) — module unlocked.` : `You scored ${correct}/${mod.quiz.length} (${modScore}%). You need 80% to pass. Review the lessons and retake.`}
            </p>
            {passed && modIdx < 4 && (
              <button onClick={onNextModule} style={{ background: '#c9a84c', color: '#0a1628', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 14, fontWeight: 700 }}>
                Continue to Module {modIdx + 2} →
              </button>
            )}
            {passed && modIdx === 3 && (
              <button onClick={onNextModule} style={{ background: '#c9a84c', color: '#0a1628', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 14, fontWeight: 700 }}>
                Take Final Certification →
              </button>
            )}
          </div>
          {failed && (
            <button onClick={() => window.location.reload()} style={{ background: '#0a1628', color: '#c9a84c', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 14, fontWeight: 600 }}>
              Review Module & Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── FINAL MODULE ─────────────────────────────────────────────────────────────
function FinalModule({ mod, quizAnswers, quizComplete, modScore, answerQuiz, certData, candName, setCandName, generating, generateCert, printCert, allModulesComplete }) {
  const passed = modScore !== undefined && modScore >= 80;
  const correct = mod.quiz.filter((q, i) => quizAnswers[i] === q.correct).length;

  if (!allModulesComplete) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', paddingTop: 60 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🔒</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#0a1628', marginBottom: 12 }}>Complete All Modules First</h1>
        <p style={{ fontSize: 15, color: '#5a6478', lineHeight: 1.7 }}>You must pass Modules 1–4 with 80% or higher before taking the Final Certification. Go back and complete any remaining modules.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760 }}>
      {!quizComplete && (
        <>
          <div style={{ background: 'linear-gradient(135deg, #0a1628, #1a3a5c)', borderRadius: 16, padding: '32px 36px', marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(201,168,76,0.08)' }}></div>
            <div style={{ fontSize: 11, color: '#c9a84c', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Final Certification</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#f8f4ec', marginBottom: 10, lineHeight: 1.2 }}>Prove Your Mastery</h1>
            <p style={{ fontSize: 15, color: 'rgba(248,244,236,0.65)', lineHeight: 1.7, marginBottom: 20, maxWidth: 480 }}>
              {mod.quiz.length} questions across all four modules. Score 80% or higher to earn your SelectiveCrew Duty-Free Sales certificate.
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {[['Questions', mod.quiz.length], ['Pass mark', '80%'], ['Attempts', 'Unlimited']].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#c9a84c', fontWeight: 600 }}>{v}</div>
                  <div style={{ fontSize: 12, color: 'rgba(248,244,236,0.5)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <QuizView mod={mod} modIdx={4} quizAnswers={quizAnswers} quizComplete={quizComplete}
            modScore={modScore} answerQuiz={answerQuiz} onNextModule={() => {}} nextUnlocked={false} />
        </>
      )}

      {quizComplete && passed && !certData && (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
          <div style={{ background: 'linear-gradient(135deg, #0a1628, #1a3a5c)', borderRadius: 16, padding: '32px', textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#f8f4ec', marginBottom: 8 }}>Congratulations!</h2>
            <p style={{ fontSize: 15, color: 'rgba(248,244,236,0.7)', marginBottom: 4 }}>You scored {correct}/{mod.quiz.length} ({modScore}%) on the Final Certification</p>
            <p style={{ fontSize: 13, color: 'rgba(248,244,236,0.5)' }}>Enter your full name to generate your certificate</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e8eef8', borderRadius: 14, padding: '24px 28px', marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0a1628', marginBottom: 10 }}>Your full name (as it will appear on the certificate)</label>
            <input value={candName} onChange={e => setCandName(e.target.value)} placeholder="Enter your full name"
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e8eef8', borderRadius: 10, fontSize: 15, color: '#0a1628', marginBottom: 14, outline: 'none', fontFamily: 'inherit' }} />
            <button onClick={generateCert} disabled={generating}
              style={{ background: '#c9a84c', color: '#0a1628', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 14, fontWeight: 700, opacity: generating ? 0.6 : 1 }}>
              {generating ? 'Generating...' : 'Generate My Certificate →'}
            </button>
          </div>
        </div>
      )}

      {quizComplete && passed && certData && (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
          <div style={{ background: '#0a1628', padding: 6, borderRadius: 6, marginBottom: 20 }}>
            <div style={{ background: '#fff', border: '2px solid #c9a84c', padding: '40px 36px', textAlign: 'center', position: 'relative' }}>
              {[['tl','2px 0 0 2px'],['tr','2px 2px 0 0'],['bl','0 0 2px 2px'],['br','0 2px 2px 0']].map(([cls, bw]) => (
                <div key={cls} style={{ position: 'absolute', width: 36, height: 36, borderColor: '#c9a84c', borderStyle: 'solid', borderWidth: bw, ...(cls==='tl'?{top:12,left:12}:cls==='tr'?{top:12,right:12}:cls==='bl'?{bottom:12,left:12}:{bottom:12,right:12}) }}></div>
              ))}
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#c9a84c', lineHeight: 1.4, textAlign: 'center' }}>SELECTIVE<br/>CREW<br/>CERTIFIED</div>
              </div>
              <div style={{ fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: '#5a6478', marginBottom: 8 }}>Selective<span style={{ color: '#c9a84c', fontWeight: 600 }}>Crew</span> Training Institute</div>
              <div style={{ width: 60, height: 1, background: '#c9a84c', margin: '10px auto' }}></div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#5a6478', marginBottom: 12 }}>Certificate of Completion</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: '#0a1628', marginBottom: 16 }}>Duty-Free Sales Excellence</div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: '#5a6478', marginBottom: 6 }}>Proudly awarded to</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontStyle: 'italic', color: '#0a1628', borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 14 }}>{certData.name}</div>
              <div style={{ fontSize: 12, color: '#5a6478', lineHeight: 1.65, maxWidth: 400, margin: '0 auto 14px' }}>Having successfully completed all four modules of the SelectiveCrew Duty-Free Sales Excellence programme.</div>
              <div style={{ display: 'inline-block', padding: '7px 20px', background: '#fef9ed', border: '1px solid #c9a84c', borderRadius: 30, fontSize: 12, fontWeight: 500, color: '#856a1a', marginBottom: 18 }}>
                Score: {certData.score}/{certData.total} ({certData.pct}%) · {certData.date}
              </div>
              <div style={{ background: '#fff8e1', border: '1px solid #e8d5a0', borderRadius: 8, padding: '12px 16px', textAlign: 'left', marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#c9a84c', marginBottom: 5 }}>Employment Disclaimer</div>
                <p style={{ fontSize: 11, color: '#6b5515', lineHeight: 1.55 }}>This certificate confirms training completion only. It does <strong>not</strong> constitute a job offer or guarantee of employment. Placement depends on English proficiency, personality, character, professional conduct, and interview performance — all assessed independently by SelectiveCrew.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
                <div style={{ textAlign: 'center' }}><div style={{ height: 1, background: '#eee', marginBottom: 6 }}></div><div style={{ fontSize: 12, fontWeight: 500, color: '#0a1628' }}>SelectiveCrew</div><div style={{ fontSize: 11, color: '#5a6478' }}>Training Department</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ height: 1, background: '#eee', marginBottom: 6 }}></div><div style={{ fontSize: 12, fontWeight: 500, color: '#0a1628' }}>{certData.name}</div><div style={{ fontSize: 11, color: '#5a6478' }}>Candidate</div></div>
              </div>
              <div style={{ fontSize: 10, color: '#ccc', marginTop: 14 }}>Certificate ID: {certData.certId} · selectivecrew.com/verify?id={certData.certId}</div>
            </div>
          </div>
          <button onClick={printCert} style={{ background: '#0a1628', color: '#c9a84c', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 14, fontWeight: 600 }}>
            Print / Save as PDF →
          </button>
        </div>
      )}

      {quizComplete && !passed && (
        <div style={{ animation: 'fadeIn 0.4s ease', textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#0a1628', marginBottom: 8 }}>Almost There</h2>
          <p style={{ fontSize: 14, color: '#5a6478', marginBottom: 24 }}>You scored {correct}/{mod.quiz.length} ({modScore}%). You need 80% to earn your certificate. Review the modules and try again.</p>
          <button onClick={() => window.location.reload()} style={{ background: '#0a1628', color: '#c9a84c', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 14, fontWeight: 600 }}>
            Review & Retry
          </button>
        </div>
      )}
    </div>
  );
}

// ─── VISUAL ILLUSTRATIONS ────────────────────────────────────────────────────
function VisualIllustration({ type }) {
  const base = { background: 'linear-gradient(135deg, #f0f4f8, #e8eef8)', borderRadius: 16, padding: '32px 24px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160, overflow: 'hidden', position: 'relative' };

  const illustrations = {
    ship: (
      <div style={base}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #e8f4fd 0%, #b8d8f0 100%)', borderRadius: 16 }}></div>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 64, animation: 'float 3s ease-in-out infinite' }}>🚢</div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['🏪 Duty-Free', '💰 Tax Savings', '🌍 Global Ports'].map(t => (
              <div key={t} style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#0a1628', fontWeight: 500 }}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    ),
    savings: (
      <div style={{ ...base, background: 'linear-gradient(135deg, #0a1628, #1a3a5c)' }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {[['Home Price', '$280', '#e8eef8', '#0a1628'], ['Duty-Free', '$195', '#c9a84c', '#0a1628']].map(([label, price, bg, col]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ background: bg, borderRadius: 12, padding: '12px 20px', marginBottom: 8 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: col }}>{price}</div>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{label}</div>
            </div>
          ))}
          <div style={{ fontSize: 32, color: '#c9a84c', fontWeight: 700 }}>= 30% OFF</div>
        </div>
      </div>
    ),
    spirits: (
      <div style={{ ...base, background: 'linear-gradient(135deg, #1a0a00, #3d1a00)' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
          {['🥃', '🍾', '🥂', '🍷', '🫗'].map((emoji, i) => (
            <div key={i} style={{ fontSize: 32 + i * 4, animation: `float ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}>{emoji}</div>
          ))}
        </div>
      </div>
    ),
    perfume: (
      <div style={{ ...base, background: 'linear-gradient(135deg, #1a0a1a, #2d1445)' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ fontSize: 56, animation: 'float 2.5s ease-in-out infinite' }}>💄</div>
          <div>
            {['🌸 Floral', '🌲 Woody', '🌙 Oriental', '🌊 Fresh'].map(f => (
              <div key={f} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>{f}</div>
            ))}
          </div>
        </div>
      </div>
    ),
    jewelry: (
      <div style={{ ...base, background: 'linear-gradient(135deg, #1a1400, #3d3000)' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {['💍', '⌚', '📿', '💎'].map((e, i) => (
            <div key={i} style={{ fontSize: 36 + i * 4, animation: `float ${2 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}>{e}</div>
          ))}
        </div>
      </div>
    ),
    aces: (
      <div style={{ ...base }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {[['A', 'Approach', '#0a1628'], ['C', 'Clarify', '#1a3a5c'], ['E', 'Educate', '#0f6e56'], ['S', 'Seal', '#c9a84c']].map(([letter, word, bg], i) => (
            <div key={i} style={{ background: bg, padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none', borderRadius: i === 0 ? '12px 0 0 12px' : i === 3 ? '0 12px 12px 0' : 0 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 600, color: bg === '#c9a84c' ? '#0a1628' : '#c9a84c' }}>{letter}</div>
              <div style={{ fontSize: 11, color: bg === '#c9a84c' ? '#0a1628' : 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{word}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    upsell: (
      <div style={{ ...base, background: 'linear-gradient(135deg, #0f6e56, #1a3a5c)' }}>
        <div style={{ display: 'flex', align: 'center', gap: 16, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>UPT 1.2</div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 16px' }}>
              <div style={{ fontSize: 28 }}>🥃</div>
            </div>
          </div>
          <div style={{ fontSize: 24, color: '#c9a84c', fontWeight: 700 }}>→</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#c9a84c', marginBottom: 4 }}>UPT 1.8</div>
            <div style={{ background: 'rgba(201,168,76,0.2)', border: '1px solid #c9a84c', borderRadius: 8, padding: '8px 16px' }}>
              <div style={{ fontSize: 28 }}>🥃🍫</div>
            </div>
          </div>
          <div style={{ background: 'rgba(201,168,76,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#c9a84c', fontWeight: 600 }}>+40%</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>performance</div>
          </div>
        </div>
      </div>
    ),
    objection: (
      <div style={{ ...base }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 500 }}>
          {[['I will think about it', 'Port closes tomorrow — here is the reference number'], ['Too expensive', 'At home this costs 30% more — you are already saving'], ['Just browsing', 'Of course — shopping for yourself or as a gift?']].map(([obj, resp], i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ flex: 1, background: '#fcebeb', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#501313' }}>{obj}</div>
              <div style={{ fontSize: 16, color: '#c9a84c' }}>→</div>
              <div style={{ flex: 1, background: '#eaf3de', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#27500a' }}>{resp}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    age: (
      <div style={{ ...base, background: 'linear-gradient(135deg, #1a0505, #3d0f0f)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🪪</div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[['18+', 'International waters'], ['21+', 'US port voyages']].map(([age, label]) => (
              <div key={age} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#c9a84c', fontWeight: 600 }}>{age}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    customs: (
      <div style={{ ...base }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' }}>
          {[['🇺🇸', '$800', '1L spirits'], ['🇪🇺', '€430', '1L spirits'], ['🇬🇧', '£390', '1L spirits'], ['🇨🇦', 'CAD$800', '1.14L'], ['🇦🇺', 'AUD$900', '2.25L'], ['🌍', 'Varies', 'Always check']].map(([flag, amount, limit]) => (
            <div key={flag} style={{ background: '#f8faff', border: '1px solid #e8eef8', borderRadius: 10, padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{flag}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0a1628' }}>{amount}</div>
              <div style={{ fontSize: 10, color: '#5a6478' }}>{limit}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    port: (
      <div style={{ ...base, background: 'linear-gradient(135deg, #0a1628, #1a3a5c)' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {[['⚓', 'In Port', 'SEALED', '#e24b4a'], ['🌊', 'At Sea', 'OPEN', '#1D9E75']].map(([icon, label, status, col]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>{label}</div>
              <div style={{ background: col, borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#fff' }}>{status}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return illustrations[type] || <div style={base}></div>;
}
