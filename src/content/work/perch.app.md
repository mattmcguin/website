# ![Perch Reader logo](https://prod.r2-perch.com/Avatar-03.png) Perch Reader ([perch.app](https://perch.app))

![Users](https://img.shields.io/badge/Users-~20K-2ea043?style=for-the-badge) ![Publications](https://img.shields.io/badge/Publications-13K-1f6feb?style=for-the-badge) ![Articles](https://img.shields.io/badge/Articles-3.3M-6f42c1?style=for-the-badge)

Free reading aggregator with AI chat and listening across the open web.

## Project Snapshot

- Role: Co-Founder + CTO (hands-on)
- Built From: Scratch, from concept through launch and iteration
- Team: 4 engineers across product and platform
- Scale: ~20K users, 13K publications, 3.3M indexed articles
- Product Surface: Web + mobile with synced reading state

## Problem + Positioning

### Problem

People who read long-form content across many sources end up with fragmented workflows, duplicate feeds, and low signal discovery.

### Positioning

Built to make high-signal writing easier to discover and consume by unifying blogs, RSS, Substack, Beehiiv, and X into one personalized feed.

### Product Strategy

- Kept a free core experience to maximize catalog growth and habit formation
- Offered premium AI chat and unlimited listening for power users
- Focused on practical utility over novelty: better discovery, better consumption, less feed friction

## My Role + Ownership

- Led product and technical direction from zero to launch and iteration
- Managed 4 engineers while staying hands-on in full stack delivery
- Owned architecture decisions across ingestion, search, ranking, sync, and AI features
- Drove roadmap prioritization based on user feedback and retention signals

## Team + Leadership

### Team Composition

- Engineering: 4 engineers plus me as player-coach CTO
- Cross-functional collaboration with product and design stakeholders

### Team Dynamic

- Fast weekly build-measure-learn loops
- Small ownership pods by surface area (ingestion/search, web/mobile, growth features)
- Lightweight planning and high shipping cadence to validate hypotheses quickly

### Management Scope

- Directly managed 4 engineers
- Set technical direction, reviewed architecture, and mentored implementation quality
- Balanced delivery velocity with reliability for a growing data/index footprint

## Architecture + Technical Stack

### Core Stack

- TypeScript
- React (web)
- React Native (mobile)
- Express
- Supabase/Postgres
- Elasticsearch
- Railway and Cloudflare
- ElevenLabs TTS

### Architecture Notes

- Shared product logic across web and mobile clients to keep behavior consistent
- Indexed 13K publications and 3.3M articles for fast retrieval and discovery
- Integrated AI chat and listening directly into the reading workflow
- Designed for rapid full-stack iteration with clear paths to harden reliability over time

## Key Technical Challenges + Solutions

### Challenge 1: Unified Ingestion Across Heterogeneous Sources

- Context: Sources had inconsistent formats, metadata quality, and update patterns.
- Solution: Built normalization and indexing workflows that converged multiple source types into one search/discovery model.
- Result: Reliable multi-source feed quality at 13K publication scale.

Code snippet to add (ingestion normalization):
// TODO: Add production ingestion/normalization example from Perch backend.
// Suggested focus: canonical URL dedupe + metadata fallback strategy.

Screenshot to add:

- Feed showing mixed-source aggregation quality
- Publication detail view with normalized metadata

### Challenge 2: Cross-Platform Sync and Reading Continuity

- Context: Users moved between web and mobile and expected seamless continuity.
- Solution: Shared TypeScript domain logic and aligned state behavior between React and React Native surfaces.
- Result: Consistent reading and feature behavior across clients.

Code snippet to add (sync logic):
// TODO: Add snippet showing reading state sync model (cursor/progress/bookmarks).

Screenshot to add:

- Side-by-side web/mobile continuity flow

### Challenge 3: AI Chat + Listening Embedded in Core UX

- Context: AI features often feel bolted on and can hurt product clarity.
- Solution: Integrated chat and TTS into existing reading flows, then used feedback to tune the premium value line.
- Result: Higher retention among power users and stronger session depth.

Code snippet to add (AI/TTS integration):
// TODO: Add endpoint or client integration snippet for chat or TTS handoff.

Screenshot to add:

- In-article AI chat interaction
- Listening mode player experience

## Outcomes + Impact

- Reached meaningful scale with a broad, diverse reading catalog
- Validated demand for unified discovery + consumption in one product
- Improved retention through AI chat and unlimited listening for power users

## Lessons Learned

- Search/discovery quality is the core moat in multi-source reading products
- Premium conversion improves when AI features are embedded in existing user jobs
- Cross-platform consistency matters more than feature count for recurring use

## What I Would Do Next

- Add deeper ranking personalization and feedback loops
- Expand creator/publication tooling to strengthen supply quality
- Formalize reliability targets and SLOs as index and user scale grows

## Links + Artifacts

- Product: [perch.app](https://perch.app)
- Add: architecture diagram, launch changelog, retention dashboard screenshot, and key PR links
