// Workbench seed data and defaults.

export const introTabPath = 'START_HERE.jsx';

export const staticFileContents = {
  [introTabPath]: `// This tab is rendered as a React component in the editor.`,
  'README.md': `# Personal Website Workspace

This project is a VS Code-style portfolio that opens with a pinned story view.

## How to Navigate
- Keep \`START_HERE.jsx\` open for the full founder + engineer narrative.
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
  'products/gm.xyz.md': `# gm.xyz

Decentralized crypto social network with Reddit-style communities and chat.

## What We Built
- Ethereum wallet auth (Sign in with wallet).
- Token-gated communities with custom access requirements.
- Forum and chat communication modes in one product.

## Outcome
- ~50,000 signups.
- ~2,000 MAUs.
- Competed with Farcaster and Lens in the same emerging category.
`,
  'products/joinperch.com.md': `# joinperch.com

Creator AMA + knowledge repository platform.

## What We Built
- Creator Q&A workflows to build searchable knowledge backlogs.
- A deduplication layer for recurring audience questions.
- Paid subscription tiers for monetization.

## Outcome
- 1,000+ creators onboarded.
- 100,000 unique users reading and asking questions.
- Product remains available today.
`,
  'products/perch.app.md': `# perch.app (Perch Reader)

Writing aggregation platform: "Spotify for reading."

## What We Built
- Aggregation across personal blogs, RSS, Substack, Beehiiv, and X.
- Web and mobile experiences for long-form reading.
- Ranking, curation, and feed quality workflows.

## Context + Outcome
- Built as the largest venture-scale opportunity in our roadmap.
- Still available on web and app stores.
- We wound down after paywalls increased and supply became increasingly gated.
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
`,
  'test/test.js': `export function runTest() {
  return 'Sidebar test file loaded.';
}
`
};

export const tree = [
  {
    type: 'file',
    name: 'START_HERE.jsx',
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
  },
  {
    type: 'folder',
    name: 'test',
    children: [{ type: 'file', name: 'test.js', path: 'test/test.js' }]
  }
];

export const defaultOpen = new Set(['products', 'career', 'stack', 'test']);
export const defaultFile = introTabPath;
export const pinnedTabPaths = [introTabPath];
export const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || 'mattmcguin';
