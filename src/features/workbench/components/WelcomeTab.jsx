const deepLinks = [
  { label: "Perch Reader Deep Dive", path: "work/perch.app" },
  { label: "Perch Deep Dive", path: "work/joinperch.com" },
  { label: "gm.xyz Deep Dive", path: "work/gm.xyz" },
  { label: "Technical Stack", path: "personal/technologies.md" },
];

const workRows = [
  {
    company: "Perch Reader",
    role: "Co-Founder + CTO",
    period: "Current",
    icon: "https://prod.r2-perch.com/Avatar-03.png",
    companyUrl: "https://perch.app",
  },
  {
    company: "Perch",
    role: "Co-Founder + CTO",
    period: "Apr 2023 - Nov 2023",
    icon: "https://prod.r2-perch.com/media/icon.png",
    companyUrl: "https://joinperch.com",
  },
  {
    company: "gm.xyz",
    role: "Co-Founder + CTO",
    period: "Sep 2021 - Apr 2023",
    icon: "https://prod.r2-perch.com/media/gm.xyz.png",
    companyNote: "This service is deprecated and no longer has an active site.",
  },
  {
    company: "ThoughtWorks",
    role: "Senior Software Engineer",
    period: "Aug 2019 - Sep 2021",
    icon: "/images/work/thoughtworks.jpg",
    companyUrl: "https://www.thoughtworks.com/en-us",
  },
  {
    company: "WillowTree",
    role: "Senior Software Engineer",
    period: "Oct 2016 - Aug 2019",
    icon: "/images/work/willowtree.png",
    companyUrl: "https://www.telusdigital.com/willowtree-is-now-telus-digital",
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

export default function WelcomeTab({ onOpenFile }) {
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
              with my brother <a
                href="https://x.com/mikemcg0"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mike
              </a>.
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
            {workRows.map((row) => {
              const rowContent = (
                <>
                  <img
                    src={row.icon}
                    alt={`${row.company} logo`}
                    className="about-c6-work-icon"
                  />
                  <strong className="about-c6-work-name">{row.company}</strong>
                  <time className="about-c6-work-period">{row.period}</time>
                  <span className="about-c6-work-role">{row.role}</span>
                </>
              );

              return (
                <li key={`${row.company}-${row.period}`}>
                  {row.companyUrl ? (
                    <a
                      href={row.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="about-c6-work-row about-c6-work-row-link"
                    >
                      {rowContent}
                    </a>
                  ) : (
                    <div
                      className="about-c6-work-row about-c6-work-row-static"
                      data-tooltip={row.companyNote}
                      title={row.companyNote}
                      aria-label={`${row.company}. ${row.companyNote}`}
                      tabIndex={0}
                    >
                      {rowContent}
                    </div>
                  )}
                </li>
              );
            })}
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
