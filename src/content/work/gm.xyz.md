# ![gm.xyz logo](https://prod.r2-perch.com/media/gm.xyz.png) gm.xyz ([gm.xyz](https://gm.xyz))
![Total Users](https://img.shields.io/badge/Total%20Users-~30K-2ea043?style=for-the-badge) ![Role](https://img.shields.io/badge/Role-Co--Founder%20%2B%20CTO-6f42c1?style=for-the-badge)

Crypto-native social network for communities built around tokens, NFTs, and DAOs.


## Project Snapshot
- Role: Co-Founder + CTO (hands-on)
- Built From: Scratch, from concept through launch and growth iteration
- Scale: ~30K users
- Product Surface: Cross-platform social product for token-based communities

## Problem + Positioning

### Problem
Web3 communities were operating in high-volume chat environments where signal was hard to preserve, discover, and moderate over time.

### Positioning
Designed as an asynchronous, organized alternative to high-volume Discord chat so communities could find the best content faster.

### Product Strategy
- Prioritized signal quality with ranked discussions over purely chronological chat
- Combined web2 usability with web3-native identity and access controls
- Focused on community health through stronger moderation and anti-spam systems

## My Role + Ownership
- Built the product from zero to launch as Co-Founder + CTO
- Led product and technical direction across social UX, identity, and access models
- Owned architecture and implementation across web, mobile, backend, and auth flows
- Set roadmap priorities based on adoption and engagement signals

## Team + Leadership

### Team Composition
- Founding team led by me as player-coach CTO
- Add exact team composition here (engineering, product, design)

### Team Dynamic
- Fast iteration cycles with direct user feedback from active communities
- Tight collaboration between product, engineering, and moderation needs
- High shipping cadence to validate behavior and safety assumptions quickly

### Management Scope
- Add exact reporting/mentorship scope here (who I managed directly)
- Drove architecture reviews and technical quality standards
- Balanced speed with stability while scaling community activity

## Architecture + Technical Stack

### Core Stack
- TypeScript
- React (web)
- React Native (mobile)
- Qovery-hosted backend
- Wallet and token/NFT authorization flows

### Architecture Notes
- Built wallet-based identity and authorization to remove username/password friction
- Integrated token and NFT-aware access logic for member-specific spaces and features
- Shipped shared TypeScript patterns across web and mobile for consistency
- Used a web2-first stack for speed while defining a progressive decentralization roadmap

## Key Technical Challenges + Solutions

### Challenge 1: Wallet-Native Identity and Access Control
- Context: Community access needed to reflect on-chain ownership without adding onboarding friction.
- Solution: Implemented Sign in with Ethereum and token/NFT authorization flows tied to product permissions.
- Result: Lower-friction onboarding with credible token-aware access control.

Code snippet to add (SIWE + authorization):
    // TODO: Add auth flow snippet showing SIWE verification and token-gated policy checks.

Screenshot to add:
- Wallet sign-in flow
- Token-gated community access state

### Challenge 2: Signal-First Feed in a Social Context
- Context: Chronological chat buried valuable contributions and reduced long-term knowledge value.
- Solution: Built Reddit-like ranking to promote high-signal posts and reduce timeline noise.
- Result: Better content discoverability and stronger asynchronous discussion quality.

Code snippet to add (ranking logic):
    // TODO: Add scoring/ranking snippet that balances recency and engagement.

Screenshot to add:
- Ranked feed view
- Post engagement and sorting controls

### Challenge 3: Community Safety and Moderation at Early Scale
- Context: Open participation can degrade quality without clear moderation controls.
- Solution: Added moderation permissions, contribution signals, and anti-spam guardrails.
- Result: Improved community health and better trust in shared spaces.

Code snippet to add (moderation/anti-spam):
    // TODO: Add moderation rules or anti-spam enforcement snippet.

Screenshot to add:
- Moderator controls panel
- Community permissions settings

## Outcomes + Impact
- Validated demand for structured, asynchronous web3 community tooling
- Reached meaningful early network activity in a highly competitive social category
- Proved that web3 identity and gating can enhance, not hurt, core social UX

## Lessons Learned
- Signal ranking and moderation quality matter more than raw activity volume
- Wallet-native UX must feel as fast and reliable as web2 login patterns
- Early safety systems are product-critical, not just operational add-ons

## What I Would Do Next
- Deepen ranking personalization and author reputation systems
- Expand moderation tooling and policy automation for larger communities
- Formalize reliability targets as social graph and usage density grow

## Links + Artifacts
- Product: [gm.xyz](https://gm.xyz)
- Add: architecture diagram, moderation workflow capture, and key PR links
