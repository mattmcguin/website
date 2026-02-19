const productTimeline = [
  {
    name: 'Perch Reader',
    href: 'https://perch.app',
    logo: 'https://prod.r2-perch.com/Avatar-03.png',
    summary:
      'Free reading aggregator with AI chat and listening across the open web.',
    detail: 'Built to make high-signal writing easier to discover and consume by unifying blogs, RSS, Substack, Beehiiv, and X into one personalized feed.',
    productHighlights: [
      'Positioned as a free product with premium AI chat and unlimited listening for power users',
      'Shipped a cross-platform reading experience with consistent sync between web and mobile',
      'Improved content discovery quality with curation and feed controls informed by active user feedback'
    ],
    technicalHighlights: [
      'Managed a team of 4 engineers while continuing hands-on full stack product development',
      'TypeScript across React (web) and React Native (mobile) with shared product logic',
      'Express services on Railway backed by Supabase + Postgres, with Elasticsearch for search and content retrieval',
      'Indexed 13K publications and 3.3M articles to build out a diverse catalog of content for readers',
      'Integrated ElevenLabs TTS for high-quality audio playback and used Cloudflare for edge performance and reliability'
    ],
    statsStyle: 'pill',
    stats: [
      { label: 'Total Users', value: '~20K' }
    ],
    filePath: 'products/perch.app.md'
  },
  {
    name: 'Perch',
    href: 'https://joinperch.com',
    logo: 'https://prod.r2-perch.com/media/icon.png',
    summary: 'Creator platform that turns audience questions into newsletters and SEO-friendly knowledge pages.',
    detail:
      'Built to help creators grow owned distribution and monetize expertise through paywalls, bounties, and sponsorships.',
    productHighlights: [
      'Turned audience questions into publishable newsletter content with a repeatable creator workflow',
      'Enabled creators to build an email list they own while creating a durable, shareable knowledge base',
      'Supported monetization through paywalls, question bounties, and sponsorships with a creator-first model'
    ],
    technicalHighlights: [
      'Built Q&A capture and publishing flows that reduced friction from incoming question to live answer',
      'Shipped SEO-optimized answer pages designed for long-tail discovery and evergreen content performance',
      'Implemented subscription and monetization controls to support free and paid creator offerings'
    ],
    statsStyle: 'pill',
    stats: [
      { label: 'Total Users', value: '~100K' }
    ],
    filePath: 'products/joinperch.com.md'
  },
  {
    name: 'gm.xyz',
    href: 'https://gm.xyz',
    logo: 'https://prod.r2-perch.com/media/gm.xyz.png',
    summary: 'Crypto-native social network for communities built around tokens, NFTs, and DAOs.',
    detail:
      'Designed as an asynchronous, organized alternative to high-volume Discord chat so communities could find the best content faster.',
    productHighlights: [
      'Enabled public and private communities with Reddit-like ranking so top posts rise above noisy chronological chat',
      'Supported wallet-native onboarding through Sign in with Ethereum and token-gated access for member-specific channels',
      'Improved community health with stronger moderation controls, contribution signals, and anti-spam permissions'
    ],
    technicalHighlights: [
      'Built wallet-based identity and authorization flows that removed username/password friction for web3-native users',
      'Integrated token and NFT-aware access logic to unlock community features based on on-chain ownership',
      'Shipped as a TypeScript codebase across React web and React Native apps, with the backend servers hosted on Qovery',
      'Executed with a web2-first stack for product speed while defining a progressive decentralization roadmap over time'
    ],
    statsStyle: 'pill',
    stats: [
      { label: 'Total Users', value: '~30K' }
    ],
    filePath: 'products/gm.xyz.md'
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
        <div className="story-hero-title">
          <img
            src="https://prod.r2-perch.app/media/matt-mcguiness.png"
            alt="Matt McGuiness"
            className="story-hero-avatar"
          />
          <div className="story-hero-name">
            <h1>Matt McGuiness</h1>
            <span className="story-hero-meta">New York City, NY</span>
          </div>
        </div>
        <p className="story-lede">
          I'm a founder and full stack engineer based in NYC. For the past five years, I&apos;ve been working on GM Labs with my co-founder and brother{' '}
          <a href="https://x.com/mikemcg0" target="_blank" rel="noreferrer">
            Mike
          </a>
          . We&apos;ve built three products in that time which you can read more about below.
        </p>
      </header>

      <section className="story-panel">
        <h2 className="story-products-heading">Products</h2>
        <div className="story-products">
          {productTimeline.map((product) => (
            <article key={product.name} className="story-product-card">
              <div className="story-product-head">
                <img src={product.logo} alt={`${product.name} logo placeholder`} className="story-product-logo" />
                <div className="story-product-title-wrap">
                  <a href={product.href} target="_blank" rel="noreferrer">
                    {product.name}
                  </a>
                  <span>{product.href.replace('https://', '')}</span>
                </div>
                <div className="story-product-head-actions">
                  <div className={`story-product-stats story-product-stats-${product.statsStyle}`}>
                    {product.stats.map((stat) => (
                      <div key={stat.label} className="story-product-stat">
                        <span className="story-product-stat-label">{stat.label}</span>
                        <strong className="story-product-stat-value">{stat.value}</strong>
                      </div>
                    ))}
                  </div>
                  <a
                    className="story-product-open story-product-open-inline"
                    href={product.filePath}
                    onClick={(event) => handleFileLink(product.filePath, event)}
                  >
                    Read More
                  </a>
                </div>
              </div>
              <p>{product.summary}</p>
              {product.detail ? <p>{product.detail}</p> : null}
              {product.productHighlights || product.technicalHighlights ? (
                <div className="story-product-breakdown">
                  {product.productHighlights?.length ? (
                    <div className="story-product-section">
                      <h4>Product</h4>
                      <ul className="story-product-highlights">
                        {product.productHighlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {product.technicalHighlights?.length ? (
                    <div className="story-product-section">
                      <h4>Technical</h4>
                      <ul className="story-product-highlights">
                        {product.technicalHighlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : (
                <ul className="story-product-highlights">
                  {product.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
              <a
                className="story-product-open story-product-open-bottom"
                href={product.filePath}
                onClick={(event) => handleFileLink(product.filePath, event)}
              >
                Read More
              </a>
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
