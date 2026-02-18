const headlineStats = [
  { label: 'Venture Raised', value: '$6M', detail: '776 Ventures (Alexis Ohanian)' },
  { label: 'Products Built', value: '3', detail: 'gm.xyz, joinperch.com, perch.app' },
  { label: 'Founder Journey', value: '5 years', detail: 'Hands-on product + engineering' },
  { label: 'Team Leadership', value: '4 engineers', detail: 'Managed while staying deep in the code' }
];

const productTimeline = [
  {
    name: 'gm.xyz',
    href: 'https://gm.xyz',
    summary: 'Decentralized social network with token-gated communities on Ethereum.',
    metrics: '~50K signups, ~2K MAUs',
    filePath: 'products/gm.xyz.md'
  },
  {
    name: 'joinperch.com',
    href: 'https://joinperch.com',
    summary: 'Creator AMA repository to deduplicate recurring questions and support paid tiers.',
    metrics: '1,000+ creators, 100K unique readers and askers',
    filePath: 'products/joinperch.com.md'
  },
  {
    name: 'perch.app',
    href: 'https://perch.app',
    summary: 'Reading aggregator across blogs, RSS, Substack, Beehiiv, and X.',
    metrics: 'Web + app stores, venture-scale thesis execution',
    filePath: 'products/perch.app.md'
  }
];

const stackGroups = [
  {
    title: 'Core',
    items: ['TypeScript', 'React', 'React Native', 'Expo', 'Express', 'Postgres']
  },
  {
    title: 'Infra',
    items: ['AWS', 'GCP', 'Railway', 'Qovery', 'Vercel', 'Hetzner']
  },
  {
    title: 'Data + AI',
    items: ['Supabase', 'Elasticsearch', 'Anthropic', 'OpenAI', 'Gemini', 'ElevenLabs']
  }
];

const quickFileLinks = [
  { label: 'Career Overview', path: 'career/overview.md' },
  { label: 'Next Role', path: 'career/next-role.md' },
  { label: 'Tech Stack', path: 'stack/technologies.md' },
  { label: 'Workspace README', path: 'README.md' }
];

export default function StoryLanding({ onOpenFile }) {
  function handleFileLink(path, event) {
    event.preventDefault();
    onOpenFile(path);
  }

  return (
    <div className="story-landing">
      <header className="story-hero">
        <p className="story-eyebrow">Pinned Intro</p>
        <h1>Matt McGuiness</h1>
        <p className="story-lede">
          Founder and full stack engineer who spent five years building products from zero to scale, from solo execution
          through team leadership.
        </p>
        <div className="story-external-links">
          <a href="https://gm.xyz" target="_blank" rel="noreferrer">
            gm.xyz
          </a>
          <a href="https://joinperch.com" target="_blank" rel="noreferrer">
            joinperch.com
          </a>
          <a href="https://perch.app" target="_blank" rel="noreferrer">
            perch.app
          </a>
        </div>
      </header>

      <section className="story-panel story-stats">
        {headlineStats.map((stat) => (
          <article key={stat.label} className="story-stat-card">
            <p>{stat.label}</p>
            <h2>{stat.value}</h2>
            <span>{stat.detail}</span>
          </article>
        ))}
      </section>

      <section className="story-panel">
        <h2>Product Journey</h2>
        <div className="story-products">
          {productTimeline.map((product) => (
            <article key={product.name} className="story-product-card">
              <div className="story-product-top">
                <a href={product.href} target="_blank" rel="noreferrer">
                  {product.name}
                </a>
                <a href={product.filePath} onClick={(event) => handleFileLink(product.filePath, event)}>
                  open file
                </a>
              </div>
              <p>{product.summary}</p>
              <span>{product.metrics}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="story-panel story-role-panel">
        <article>
          <h2>What I Want Next</h2>
          <p>
            Full Stack Engineering role with direct product impact, a high-velocity team, and strong technical depth.
          </p>
          <p>Based in NYC, prefer NYC roles, open to relocation for the right fit.</p>
        </article>
        <article>
          <h2>How I Work</h2>
          <p>Own end-to-end delivery, keep architecture practical, and ship continuously with measurable outcomes.</p>
          <p>Comfortable jumping into unfamiliar systems and becoming effective fast.</p>
        </article>
      </section>

      <section className="story-panel">
        <h2>Stack Used in Production</h2>
        <div className="story-stack-grid">
          {stackGroups.map((group) => (
            <article key={group.title} className="story-stack-card">
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="story-panel">
        <h2>Quick File Links</h2>
        <div className="story-file-links">
          {quickFileLinks.map((fileLink) => (
            <a key={fileLink.path} href={fileLink.path} onClick={(event) => handleFileLink(fileLink.path, event)}>
              {fileLink.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
