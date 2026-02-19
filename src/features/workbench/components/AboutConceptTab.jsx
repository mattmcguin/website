const deepLinks = [
  { label: "career/overview.md", path: "career/overview.md" },
  { label: "career/next-role.md", path: "career/next-role.md" },
  { label: "stack/technologies.md", path: "stack/technologies.md" },
  { label: "products/gm.xyz.md", path: "products/gm.xyz.md" },
  { label: "products/joinperch.com.md", path: "products/joinperch.com.md" },
  { label: "products/perch.app.md", path: "products/perch.app.md" },
];

const workRows = [
  {
    company: "Perch Reader",
    role: "Co-Founder + CTO",
    period: "Current",
    icon: "https://prod.r2-perch.com/Avatar-03.png",
  },
  {
    company: "Perch",
    role: "Co-Founder + CTO",
    period: "Apr 2023 - Nov 2023",
    icon: "https://prod.r2-perch.com/media/icon.png",
  },
  {
    company: "gm.xyz",
    role: "Co-Founder + CTO",
    period: "Sep 2021 - Apr 2023",
    icon: "https://prod.r2-perch.com/media/gm.xyz.png",
  },
  {
    company: "ThoughtWorks",
    role: "Senior Software Engineer",
    period: "Aug 2019 - Sep 2021",
    icon: "/images/work/thoughtworks.jpg",
  },
  {
    company: "WillowTree",
    role: "Senior Software Engineer",
    period: "Dec 2018 - Aug 2019",
    icon: "/images/work/willowtree.png",
  },
  {
    company: "WillowTree",
    role: "Software Engineer",
    period: "Oct 2016 - Dec 2018",
    icon: "/images/work/willowtree.png",
  },
];

function OpenFileButton({ onOpenFile, path, children, className = "" }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => onOpenFile(path)}
    >
      {children}
    </button>
  );
}

function DeepLinkRail({ onOpenFile }) {
  return (
    <div className="about-deep-links" aria-label="Open related files">
      {deepLinks.map((link) => (
        <OpenFileButton
          key={link.path}
          onOpenFile={onOpenFile}
          path={link.path}
          className="about-deep-link"
        >
          {link.label}
        </OpenFileButton>
      ))}
    </div>
  );
}

export default function AboutConceptTab({ onOpenFile }) {
  return (
    <div className="about-lab about-c6">
      <section className="about-c6-shell">
        <section className="about-c6-profile about-c6-card">
          <header className="about-c6-intro">
            <img
              src="https://prod.r2-perch.app/media/matt-mcguiness.png"
              alt="Matt McGuiness"
              className="about-c6-avatar"
            />
            <h1 className="about-c6-name">Matt McGuiness</h1>
          </header>

          <article className="about-c6-prose">
            <p>
              I&apos;m a Software Engineer living in NYC working on a startup
              with my brother.
            </p>

            <p>
              Currently we&apos;re building{" "}
              <a
                href="https://perch.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Perch Reader
              </a>
              , a free reading aggregator with AI chat and listening across the
              open web.
            </p>
            <p>
              Before Perch Reader we built a crypto-native social platform
              called gm.xyz and a creator AMA platform also called{" "}
              <a
                href="https://joinperch.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Perch
              </a>
              . Both of these products were the stepping stones necessary to
              create Perch Reader.
            </p>

            <p>
              Prior to starting GM Labs, I was a Senior Software Engineer at{" "}
              <a
                href="https://www.telusdigital.com/willowtree-is-now-telus-digital"
                target="_blank"
                rel="noopener noreferrer"
              >
                WillowTree
              </a>{" "}
              and{" "}
              <a
                href="https://www.thoughtworks.com/en-us"
                target="_blank"
                rel="noopener noreferrer"
              >
                Thoughtworks
              </a>
              .
            </p>
          </article>
        </section>

        <section className="about-c6-work about-c6-card">
          <h2 className="about-c6-heading">Work</h2>
          <ul>
            {workRows.map((row) => (
              <li key={`${row.company}-${row.period}`}>
                <div className="about-c6-work-main">
                  <img
                    src={row.icon}
                    alt={`${row.company} logo`}
                    className="about-c6-work-icon"
                  />
                  <div className="about-c6-work-copy">
                    <strong>{row.company}</strong>
                    <span>{row.role}</span>
                  </div>
                </div>
                <time>{row.period}</time>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-c6-links about-c6-card">
          <h2 className="about-c6-heading">Links</h2>
          <DeepLinkRail onOpenFile={onOpenFile} />
        </section>
      </section>
    </div>
  );
}
