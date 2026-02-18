// Workbench seed data and defaults.

export const staticFileContents = {
  'portfolio-site/README.md': `# mattmcguin.com

Portfolio site focused on recent software work.

## About
I build practical software systems that help teams ship faster.
This portfolio is intentionally structured like a repository so the work feels tangible.

## Current Focus
- AI-assisted developer workflows
- Production reliability and observability
- UX systems for internal tools
- Tooling that lowers onboarding friction

## Selected Projects
### AI Prompt Ops Toolkit
- Built reusable prompt macros for recurring workflows
- Added evaluation checklists for safer production behavior
- Standardized collaboration patterns across product teams

### Realtime Analytics Surface
- Reworked event ingestion paths for lower latency
- Added schema guardrails to reduce noisy data
- Improved debugging with richer trace context

### Design Token Sync
- Centralized token publishing and validation
- Reduced drift between product surfaces
- Improved release confidence for frontend teams

## Public Repositories
### prompt-ops-toolkit
- Command templates and operator runbooks
- Prompt evaluation guidance
- Lightweight scripts for local testing

### ui-token-sync
- Schema validation and release automation
- Multi-app distribution support
- Change visibility via CI annotations

### fast-insight-pipeline
- Query planning improvements
- Throughput and storage optimizations
- Data lifecycle hygiene and retention safeguards

## Working Principles
1. Ship small and iterate with real feedback.
2. Make tradeoffs explicit in code and docs.
3. Optimize for maintainability over novelty.
4. Prefer clear ownership boundaries.
5. Leave systems easier to operate than before.

## Project Log 2026
### January
- Shipped first pass of prompt quality checks
- Added onboarding docs for internal contributors
- Benchmarked analytics query performance baselines

### February
- Reduced dashboard latency on key views
- Added audit events for command-level visibility
- Published clearer architecture decision records

### March
- Improved release scripting and rollback process
- Aligned token naming conventions across apps
- Added safeguards for edge-case data payloads

### April
- Reworked CI caching for more stable build times
- Tightened API error handling and logging
- Improved issue triage process for faster follow-up

### May
- Streamlined local setup scripts for new developers
- Added health scorecard for repository maintenance
- Simplified stale dependency review process

### June
- Integrated quality checks into pre-merge flow
- Refined docs for debugging incident timelines
- Improved deployment visibility for stakeholders

### July
- Added runbooks for recurring support workflows
- Consolidated internal templates for consistency
- Reduced ambiguity in ownership handoffs

### August
- Expanded test coverage for core user paths
- Improved design review handoff protocol
- Hardened analytics ingestion against malformed events

### September
- Added release-notes automation helper
- Refined backlog slicing strategy for weekly cadence
- Improved instrumentation naming consistency

### October
- Tightened rate-limit handling across services
- Improved snapshot performance for large datasets
- Documented fallback strategies for critical workflows

### November
- Reduced noisy alerting by tuning thresholds
- Added examples for common extension points
- Clarified repository contribution model

### December
- Wrapped year-end reliability improvements
- Finalized migration notes for legacy modules
- Published annual engineering learnings

## Architecture Notes
### Data Boundaries
Define ownership early. Keep contracts explicit and versioned.

### Reliability
Design for observability first, then optimize bottlenecks with measurement.

### Frontend Systems
Treat design tokens and component APIs as product surfaces.

### Developer Experience
If setup is hard, contribution velocity drops. Optimize the first hour.

## Learning Backlog
- Better long-term maintainability metrics
- Faster root-cause workflows for incidents
- Improved knowledge transfer patterns
- Lightweight performance budgets for new features
- Automated quality signals for pull requests

## Next Experiments
- Context-aware code generation prompts
- Auto-suggested runbooks from issue clusters
- Better repository maps for new contributors
- Structured weekly engineering notes

## Contact
- GitHub: @mattmcguin
- Website: mattmcguin.com
- Focus: pragmatic engineering systems

## Appendix A: Notes
- This file is intentionally long to test scroll behavior.
- Preview mode should remain readable at long lengths.
- Markdown mode should keep line numbers aligned.
- Tabs and side panels should stay usable while scrolling.

## Appendix B: Additional Notes
- Keep interactions predictable.
- Preserve keyboard-friendly navigation patterns.
- Ensure responsive behavior on smaller screens.
- Prefer accessible contrast across all interface states.

## Appendix C: Deep Dive Topics
- Prompt evaluation lifecycle
- Incident communication standards
- Internal tooling prioritization
- Documentation upkeep model
- Sustainable release cadence

## End
Thanks for reading this intentionally long README.`,
  'portfolio-site/projects/ai-ops.md': `## AI Prompt Ops Toolkit

- Built reusable prompt command macros
- Added evaluation checklists for reliability
- Cut iteration loops for product teams`,
  'portfolio-site/projects/analytics-surface.md': `## Realtime Analytics Surface

- Event ingestion guardrails
- Query latency optimization
- Better debugging traces for production`,
  'portfolio-site/src/app.tsx': `export function AppShell() {
  return {
    nowBuilding: 'github.dev-inspired portfolio',
    focus: ['project narrative', 'ship cadence', 'public repos']
  };
}`,
  'public-repos/prompt-ops-toolkit/README.md': `### prompt-ops-toolkit

Reusable command templates, evaluation scripts,
and deployment notes for prompt workflows.`,
  'public-repos/ui-token-sync/README.md': `### ui-token-sync

Design token publishing pipeline with checks:
- schema validation
- semver release gates
- multi-app sync automation`,
  'public-repos/fast-insight-pipeline/README.md': `### fast-insight-pipeline

Streaming events and query planner improvements
to reduce dashboard load times and cost.`
};

export const tree = [
  {
    type: 'folder',
    name: 'portfolio-site',
    children: [
      { type: 'file', name: 'README.md', path: 'portfolio-site/README.md' },
      {
        type: 'folder',
        name: 'projects',
        children: [
          { type: 'file', name: 'ai-ops.md', path: 'portfolio-site/projects/ai-ops.md' },
          {
            type: 'file',
            name: 'analytics-surface.md',
            path: 'portfolio-site/projects/analytics-surface.md'
          }
        ]
      },
      {
        type: 'folder',
        name: 'src',
        children: [{ type: 'file', name: 'app.tsx', path: 'portfolio-site/src/app.tsx' }]
      }
    ]
  },
  {
    type: 'folder',
    name: 'public-repos',
    children: [
      {
        type: 'folder',
        name: 'prompt-ops-toolkit',
        children: [{ type: 'file', name: 'README.md', path: 'public-repos/prompt-ops-toolkit/README.md' }]
      },
      {
        type: 'folder',
        name: 'ui-token-sync',
        children: [{ type: 'file', name: 'README.md', path: 'public-repos/ui-token-sync/README.md' }]
      },
      {
        type: 'folder',
        name: 'fast-insight-pipeline',
        children: [{ type: 'file', name: 'README.md', path: 'public-repos/fast-insight-pipeline/README.md' }]
      }
    ]
  }
];

export const defaultOpen = new Set([
  'portfolio-site',
  'portfolio-site/projects',
  'portfolio-site/src',
  'public-repos',
  'public-repos/prompt-ops-toolkit'
]);
export const defaultFile = 'portfolio-site/README.md';
export const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || 'mattmcguin';
