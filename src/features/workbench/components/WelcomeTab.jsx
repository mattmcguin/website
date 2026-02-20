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
    filePath: "work/perch.app",
  },
  {
    company: "joinperch.com",
    role: "Co-Founder + CTO",
    period: "Apr 2023 - Nov 2023",
    icon: "/images/work/joinperch.com.png",
    filePath: "work/joinperch.com",
  },
  {
    company: "gm.xyz",
    role: "Co-Founder + CTO",
    period: "Sep 2021 - Apr 2023",
    icon: "https://prod.r2-perch.com/media/gm.xyz.png",
    filePath: "work/gm.xyz",
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
    <div className="welcome-deep-links" aria-label="Open related files">
      {deepLinks.map((link) => (
        <OpenFileButton
          key={link.path}
          onOpenFile={onOpenFile}
          path={link.path}
          className="welcome-deep-link"
        >
          {link.label}
        </OpenFileButton>
      ))}
    </div>
  );
}

export default function WelcomeTab({ onOpenFile }) {
  return (
    <div className="welcome-lab">
      <section className="welcome-shell">
        <section className="welcome-profile welcome-card">
          <header className="welcome-intro">
            <img
              src="https://prod.r2-perch.app/media/matt-mcguiness.png"
              alt="Matt McGuiness"
              className="welcome-avatar"
            />
            <h1 className="welcome-name">Matt McGuiness</h1>
          </header>

          <article className="welcome-prose">
            <p>
              I&apos;m a Software Engineer living in NYC working on a startup
              with my brother{" "}
              <a
                href="https://x.com/mikemcg0"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mike
              </a>
              .
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
                href="https://www.thoughtworks.com/en-us"
                target="_blank"
                rel="noopener noreferrer"
              >
                Thoughtworks
              </a>{" "}
              and{" "}
              <a
                href="https://www.telusdigital.com/willowtree-is-now-telus-digital"
                target="_blank"
                rel="noopener noreferrer"
              >
                WillowTree
              </a>
              .
            </p>
          </article>
        </section>

        <section className="welcome-work welcome-card">
          <h2 className="welcome-heading">Work</h2>
          <p className="welcome-work-note">
            Click any item below to read more about the product and its impact.
          </p>
          <ul>
            {workRows.map((row) => {
              const rowContent = (
                <>
                  <img
                    src={row.icon}
                    alt={`${row.company} logo`}
                    className="welcome-work-icon"
                  />
                  <strong className="welcome-work-name">{row.company}</strong>
                  <time className="welcome-work-period">{row.period}</time>
                  <span className="welcome-work-role">{row.role}</span>
                </>
              );

              return (
                <li key={`${row.company}-${row.period}`}>
                  {row.filePath ? (
                    <OpenFileButton
                      onOpenFile={onOpenFile}
                      path={row.filePath}
                      className="welcome-work-row welcome-work-row-link welcome-work-row-button"
                    >
                      {rowContent}
                    </OpenFileButton>
                  ) : (
                    <a
                      href={row.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="welcome-work-row welcome-work-row-link"
                    >
                      {rowContent}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="welcome-links welcome-card">
          <h2 className="welcome-heading">Links</h2>
          <DeepLinkRail onOpenFile={onOpenFile} />
        </section>
      </section>
    </div>
  );
}
