// Workbench seed data and defaults.

export const introTabPath = "Welcome";

export const staticFileContents = {
  [introTabPath]: `// Welcome tab — rendered as a custom React component.`,
  "work/gm.xyz": `# ![gm.xyz logo](https://prod.r2-perch.com/media/gm.xyz.png) gm.xyz ([gm.xyz](https://gm.xyz))

  ![Total Users](https://img.shields.io/badge/Total%20Users-~30K-2ea043?style=for-the-badge) ![Role](https://img.shields.io/badge/Role-Co--Founder%20%2B%20CTO-6f42c1?style=for-the-badge)

  Crypto-native social network for communities built around tokens, NFTs, and DAOs.

## Product
--------------------------------
### Positioning
Designed as an asynchronous, organized alternative to high-volume Discord chat so communities could find the best content faster.

### Product Highlights
- Enabled public and private communities with Reddit-like ranking so top posts rise above noisy chronological chat
- Supported wallet-native onboarding through Sign in with Ethereum and token-gated access for member-specific channels
- Improved community health with stronger moderation controls, contribution signals, and anti-spam permissions

## Technical

### Core Stack
- TypeScript
- React (web)
- React Native (mobile)
- Qovery-hosted backend
- Wallet and token/NFT authorization flows

### Technical Highlights
- Built wallet-based identity and authorization flows that removed username/password friction for web3-native users
- Integrated token and NFT-aware access logic to unlock community features based on on-chain ownership
- Shipped as a shared TypeScript codebase across web and mobile clients
- Executed with a web2-first stack for product speed while defining a progressive decentralization roadmap over time

## Outcomes
- Validated demand for structured, asynchronous web3 community tooling
- Reached meaningful early network activity in a highly competitive social category
`,
  "work/joinperch.com": `# ![Perch logo](https://prod.r2-perch.com/media/icon.png) Perch ([joinperch.com](https://joinperch.com))
![Users](https://img.shields.io/badge/Users-~100K-2ea043?style=for-the-badge) ![Creators](https://img.shields.io/badge/Creators-1%2C000%2B-1f6feb?style=for-the-badge)

Creator platform that turns audience questions into newsletters and SEO-friendly knowledge pages.

## Product

### Positioning
Built to help creators grow owned distribution and monetize expertise through paywalls, bounties, and sponsorships.

### Product Highlights
- Turned audience questions into publishable newsletter content with a repeatable creator workflow
- Enabled creators to build an email list they own while creating a durable, shareable knowledge base
- Supported monetization through paywalls, question bounties, and sponsorships with a creator-first model

## Technical

### Core Stack
- TypeScript
- React (web)
- Node/Express backend
- SEO-first publishing surfaces
- Subscription and monetization controls

### Technical Highlights
- Built Q&A capture and publishing flows that reduced friction from incoming question to live answer
- Shipped SEO-optimized answer pages designed for long-tail discovery and evergreen content performance
- Implemented subscription and monetization controls to support free and paid creator offerings
- Optimized for practical full stack delivery speed with tight product iteration loops

## Outcomes
- 1,000+ creators onboarded
- ~100K unique users reading and asking questions
- Demonstrated that creator Q&A can function as both a growth and monetization engine
`,
  "work/perch.app": `# ![Perch Reader logo](https://prod.r2-perch.com/Avatar-03.png) Perch Reader ([perch.app](https://perch.app))
![Users](https://img.shields.io/badge/Users-~20K-2ea043?style=for-the-badge) ![Publications](https://img.shields.io/badge/Publications-13K-1f6feb?style=for-the-badge) ![Articles](https://img.shields.io/badge/Articles-3.3M-6f42c1?style=for-the-badge)

Free reading aggregator with AI chat and listening across the open web.

## Product

### Positioning
Built to make high-signal writing easier to discover and consume by unifying blogs, RSS, Substack, Beehiiv, and X into one personalized feed.

### Product Highlights
- Positioned as a free product with premium AI chat and unlimited listening for power users
- Shipped a cross-platform reading experience with consistent sync between web and mobile
- Improved content discovery quality with curation and feed controls informed by active user feedback

## Technical

### Core Stack
- TypeScript
- React (web)
- React Native (mobile)
- Express
- Supabase/Postgres
- Elasticsearch
- Railway and Cloudflare
- ElevenLabs TTS

### Technical Highlights
- Managed a team of 4 engineers while continuing hands-on full stack product development
- Shared product logic across web and mobile clients
- Indexed 13K publications and 3.3M articles for search and retrieval
- Integrated AI chat and listening into the core reading experience

## Outcomes
- Reached meaningful scale with a broad, diverse reading catalog
- Validated demand for a unified reading product that combines discovery and consumption
- Improved retention through AI chat and unlimited listening for power users
`,
  "personal/technologies.md": `# Technical Stack

## Core Product Stack
- TypeScript
- React (web)
- React Native + Expo (mobile)
- Express (backend)
- Postgres + Supabase

## Infrastructure and Platform
- AWS (RDS, EC2, Route53, Secrets Manager, ECS)
- GCP
- Railway
- Qovery
- Hetzner
- Vercel

## Search + AI Integrations
- Elasticsearch
- ElevenLabs TTS
- AI SDK
- Anthropic
- OpenAI
- Gemini
`,
};

export const tree = [
  {
    type: "file",
    name: "Welcome",
    path: introTabPath,
  },
  {
    type: "folder",
    name: "work",
    children: [
      { type: "file", name: "perch.app", path: "work/perch.app" },
      { type: "file", name: "joinperch.com", path: "work/joinperch.com" },
      { type: "file", name: "gm.xyz", path: "work/gm.xyz" },
    ],
  },
  {
    type: "folder",
    name: "personal",
    children: [
      {
        type: "file",
        name: "technologies.md",
        path: "personal/technologies.md",
      },
    ],
  },
];

export const defaultOpen = new Set();
export const defaultFile = introTabPath;
export const pinnedTabPaths = [introTabPath];
export const githubUsername =
  import.meta.env.VITE_GITHUB_USERNAME || "mattmcguin";
