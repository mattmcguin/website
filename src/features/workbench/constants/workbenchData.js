// Workbench seed data and defaults.

export const introTabPath = 'Welcome';

export const staticFileContents = {
  [introTabPath]: `// Welcome tab — rendered as a custom React component.`,
  'README.md': `# Personal Website Workspace

This project is a VS Code-style portfolio that opens with a pinned story view.

## How to Navigate
- Keep the \`Welcome\` tab open for the full founder + engineer narrative.
- Open markdown files in \`products/\`, \`career/\`, and \`stack/\` for details.
- Use \`Cmd/Ctrl+P\` to quick-open any file.
`,
  'career/overview.md': `# Founder to Full Stack Engineer

I spent the last five years building and scaling products end-to-end.

## Highlights
- Raised $6M from Alexis Ohanian and 776 Ventures.
- Built three products: gm.xyz, joinperch.com, and perch.app.
- Started as a solo full-stack engineer, then managed a team of 4 engineers.
- Stayed deeply hands-on with day-to-day product and platform code.
`,
  'career/next-role.md': `# Next Role

I am looking for a Full Stack Engineering role where I can directly impact product outcomes.

## Ideal Environment
- Fast shipping culture with strong technical standards.
- Teammates with deep product and engineering experience.
- High ownership and close customer feedback loops.

## Location
- Based in NYC.
- Prefer NYC-based roles.
- Open to relocation for the right opportunity.
`,
  'products/gm.xyz.md': `# ![gm.xyz logo](https://prod.r2-perch.com/media/gm.xyz.png) gm.xyz ([gm.xyz](https://gm.xyz))

Crypto-native social platform for token, NFT, and DAO communities.

---

## TL;DR
- Built an asynchronous, organized alternative to high-volume Discord chat
- Used wallet-native identity and token-gated permissions to make web3 onboarding and moderation practical
- Grew to roughly 50,000 signups and 2,000 MAU while competing in a new category

---

## Quick Facts
| Area | Details |
| --- | --- |
| Role | Founder and full stack engineer |
| Team | Started as solo build, scaled with team leadership |
| Stage | Seed-stage social product in an emerging market |
| Users | ~50K signups, ~2K MAU |
| Core stack | TypeScript, React web app, React Native apps, backend hosted on Qovery |

---

## Problem
Crypto communities were using tools that were either too noisy (real-time chat) or not built for token-native behavior.
Important discussion got buried, moderation was hard, and identity/access were fragmented across different tools.

---

## Product Approach
### Asynchronous community by default
- Ranked posts and replies helped surface high-signal content instead of purely chronological streams
- Community contribution could be measured more clearly than in chat-only flows

### Wallet-native UX
- Sign in with Ethereum removed username/password friction
- Wallet identity unlocked token and NFT-aware community experiences

### Community controls
- Token-gated access for private channels and role-based privileges
- Stronger anti-spam and moderation controls for healthier communities

---

## Technical Execution
- Shipped as a TypeScript codebase across React web and React Native apps
- Built wallet-based identity and authorization flows tied to on-chain ownership
- Implemented token/NFT-aware access logic and moderation permission checks
- Ran backend infrastructure on Qovery to move quickly at early stage
- Followed a progressive decentralization plan while optimizing for product-market fit first

---

## Outcomes
- Reached meaningful early network activity in a highly competitive social category
- Validated demand for structured, asynchronous web3 community tooling
- Established a product foundation that could evolve from web2 speed to deeper decentralization

---

## Demo Assets
I can add GIF walkthroughs and screenshots here (onboarding, community feed, token-gated flows, moderation tools)
`,
  'products/joinperch.com.md': `# ![Perch logo](https://prod.r2-perch.com/media/icon.png) Perch ([joinperch.com](https://joinperch.com))

Creator platform that turns audience questions into newsletters and SEO-friendly knowledge pages.

---

## TL;DR
- Helped creators convert repetitive audience questions into reusable content and owned distribution
- Built monetization paths through paywalls, bounties, and sponsorships
- Scaled to over 1,000 creators and roughly 100,000 unique readers/askers

---

## Quick Facts
| Area | Details |
| --- | --- |
| Role | Founder and full stack engineer |
| Product focus | Creator growth, content reuse, and monetization |
| Users | 1,000+ creators, ~100K unique users, ~5K MAU |
| Distribution model | SEO pages + newsletter output from creator Q&A |

---

## Problem
Creators were answering the same audience questions over and over in DMs, comments, and live sessions.
Most answers were trapped in short-lived channels and did not compound into long-term audience growth.

---

## Product Approach
### Turn questions into reusable assets
- Built workflows to capture, organize, and publish recurring questions
- Converted Q&A into shareable pages and newsletter-ready content

### Grow owned distribution
- Helped creators build durable knowledge hubs that attract search traffic
- Connected Q&A output directly to email list growth and repeat engagement

### Monetize expertise
- Supported paid access patterns, bounties, and sponsorship mechanics
- Gave creators control over free versus paid answer surfaces

---

## Technical Execution
- Built end-to-end publishing flows from incoming question to live answer page
- Designed SEO-aware content structures for long-tail discoverability
- Implemented subscription and monetization controls for creator business models
- Focused on practical full stack delivery speed with strong product iteration loops

---

## Outcomes
- 1,000+ creators onboarded
- ~100K unique users reading and asking questions
- Demonstrated that creator Q&A can function as both a growth and monetization engine

---

## Demo Assets
I can add GIF walkthroughs and screenshots here (question capture, publishing flow, creator dashboard, monetization setup)
`,
  'products/perch.app.md': `# ![Perch Reader logo](https://prod.r2-perch.com/Avatar-03.png) Perch Reader ([perch.app](https://perch.app))

Free reading aggregator with AI chat and listening across the open web.

---

## TL;DR
- Unified blogs, RSS, Substack, Beehiiv, and X into one personalized feed
- Added premium AI chat and unlimited listening to improve utility and retention
- Indexed 13K publications and 3.3M articles with a full stack platform across web and mobile

---

## Quick Facts
| Area | Details |
| --- | --- |
| Role | Founder, full stack engineer, and engineering manager |
| Team | Managed 4 engineers while remaining hands-on |
| Users | ~20K total users, ~2.5K MAU |
| Content scale | 13K publications, 3.3M indexed articles |
| Core stack | TypeScript, React, React Native, Express, Supabase/Postgres, Elasticsearch |
| Platform services | Railway, Cloudflare, ElevenLabs TTS |

---

## Problem
Serious readers had fragmented workflows across many publishing platforms and apps.
Discovering high-signal writing and keeping up consistently required too much manual effort.

---

## Product Approach
### Unified discovery and reading
- Aggregated multiple content ecosystems into one stream
- Shipped feed controls and ranking iterations to improve discovery quality

### Multi-platform experience
- Delivered consistent behavior across web and mobile
- Built sync-aware reading workflows for cross-device continuity

### Premium utility
- Added AI chat and unlimited listening for advanced users
- Used audio and AI features to increase accessibility and daily utility

---

## Technical Execution
- TypeScript across React web and React Native mobile apps
- Express backend with Supabase and Postgres for core data workflows
- Elasticsearch for retrieval and search across a large content index
- Backend hosted on Railway with Cloudflare for edge performance and reliability
- ElevenLabs integration for high-quality text-to-speech playback
- Managed a team of 4 engineers while continuing hands-on full stack execution

---

## Outcomes and Learnings
- Reached meaningful scale with a broad, diverse reading catalog
- Validated demand for a unified reading product that combines discovery and consumption
- Learned how platform dependency and external paywall shifts can affect long-term supply economics

---

## Demo Assets
I can add GIF walkthroughs and screenshots here (feed ranking, search/discovery, AI chat, listening mode, cross-device flows)
`,
  'stack/technologies.md': `# Technical Stack

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
`
};

export const tree = [
  {
    type: 'file',
    name: 'Welcome',
    path: introTabPath
  },
  {
    type: 'file',
    name: 'README.md',
    path: 'README.md'
  },
  {
    type: 'folder',
    name: 'products',
    children: [
      { type: 'file', name: 'gm.xyz.md', path: 'products/gm.xyz.md' },
      { type: 'file', name: 'joinperch.com.md', path: 'products/joinperch.com.md' },
      { type: 'file', name: 'perch.app.md', path: 'products/perch.app.md' }
    ]
  },
  {
    type: 'folder',
    name: 'career',
    children: [
      { type: 'file', name: 'overview.md', path: 'career/overview.md' },
      { type: 'file', name: 'next-role.md', path: 'career/next-role.md' }
    ]
  },
  {
    type: 'folder',
    name: 'stack',
    children: [{ type: 'file', name: 'technologies.md', path: 'stack/technologies.md' }]
  }
];

export const defaultOpen = new Set();
export const defaultFile = introTabPath;
export const pinnedTabPaths = [introTabPath];
export const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || 'mattmcguin';
