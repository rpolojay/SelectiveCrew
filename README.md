# Selective Crew — Next.js Project

Recovered source code for [selectivecrew.com](https://selectivecrew.com)

## Project Structure

```
selectivecrew/
├── app/
│   ├── page.jsx              ← Homepage
│   ├── layout.jsx            ← Root layout (Navbar + Footer)
│   ├── globals.css           ← Global styles + Tailwind
│   ├── jobs/page.jsx         ← Job listings
│   ├── blog/page.jsx         ← Blog listing
│   ├── employers/page.jsx    ← Employers page
│   ├── contact/page.jsx      ← Contact form
│   └── login/page.jsx        ← Login page
├── components/
│   ├── Navbar.jsx            ← Navigation bar
│   └── Footer.jsx            ← Footer
├── lib/
│   └── firebase.js           ← Firebase config
├── .env.local                ← Firebase keys (fill in your values)
├── firebase.json             ← Firebase deployment config
└── .firebaserc               ← Firebase project link
```

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Fill in your Firebase config
Edit `.env.local` and add your real Firebase values from:
Firebase Console → Project Settings → Your Apps → SDK Setup

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-6715036493-baccc.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-6715036493-baccc
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studio-6715036493-baccc.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Firebase
```bash
firebase login
firebase deploy
```

## Pages Recovered
- `/` — Homepage with hero, stats, jobs, testimonials, FAQ, blog
- `/jobs` — Job listings with filters
- `/blog` — Blog article listing
- `/employers` — Employer solutions page
- `/contact` — Contact form
- `/login` — Login with Firebase Auth

## Pages To Add
- `/register` — Candidate registration
- `/talent-pool` — Talent pool signup
- `/pricing` — Pricing plans
- `/about` — About us
- `/jobs/[slug]` — Individual job pages
- `/blog/[slug]` — Individual blog posts
- `/employer/dashboard` — Employer dashboard
