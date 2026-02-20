const socialLinks = [
  {
    name: "github",
    label: "GitHub",
    url: `https://github.com/${import.meta.env.VITE_GITHUB_USERNAME || "mattmcguin"}`,
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/matthew-mcguiness/",
  },
  {
    name: "x",
    label: "X",
    url: "https://x.com/mattmcguin",
  },
];

const workRows = [
  {
    company: "Perch",
    role: "Co-Founder + CTO",
    period: "Current",
    icon: "https://prod.r2-perch.com/Avatar-03.png",
    filePath: "work/perch.app",
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

const resumePath = "/matt-mcguiness-resume.pdf";

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

function SocialIcon({ name }) {
  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.521-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.146 8.212h2.4V9.359c0-.216.016-.432.08-.586.174-.431.571-.878 1.239-.878.874 0 1.224.663 1.224 1.634v3.865h2.4V9.252c0-2.219-1.184-3.251-2.763-3.251-1.275 0-1.845.703-2.165 1.197h.016v-1.03h-2.4c.032.663 0 7.225 0 7.225z" />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M9.294 6.928 14.357.25h-1.2L8.761 6.047 5.251.25H1.2l5.31 8.774L1.2 15.75h1.2l4.643-6.128 3.71 6.128H14.8L9.294 6.928Zm-1.86 2.455-.538-.77L2.585 2.46h1.844l3.478 4.98.538.77 4.523 6.48h-1.844L7.434 9.383Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82a7.49 7.49 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function SocialRail() {
  return (
    <div className="welcome-social-row" aria-label="Social profiles">
      {socialLinks.map((link) => (
        <a
          key={link.url}
          href={link.url}
          className="welcome-social-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          title={link.label}
        >
          <SocialIcon name={link.name} />
        </a>
      ))}
    </div>
  );
}

export default function WelcomeTab({ onOpenFile, introAction = null }) {
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
            <div className="welcome-intro-main">
              <h1 className="welcome-name">Matt McGuiness</h1>
              {introAction ? (
                <div className="welcome-intro-action">{introAction}</div>
              ) : null}
            </div>
          </header>

          <article className="welcome-prose">
            <p>
              Hi, I'm the co-founder and CTO of{" "}
              <a
                href="https://perch.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Perch
              </a>
              . Our mission is to make reading free and delightful, which we
              wrote about here:
              <ul className="welcome-prose-list">
                <li>
                  <a href="https://perch.app/blog/how-perch-will-make-reading-free">
                    How Perch Will Make Reading Free
                  </a>
                </li>
                <li>
                  <a href="https://perch.app/blog/the-future-of-books">
                    The Future of Books
                  </a>
                </li>
              </ul>
            </p>

            <p>
              Before Perch I was the co-founder and CTO of gm.xyz, which was one
              of the first crypto-native social networks to reach tens of
              thousands of users. In hindsight, the idea was too early, but the
              promise of decentralized social media is something I still believe
              in.
            </p>

            <p>
              My life's work is building great products, ideally ones I use
              myself. If you'd like to get in touch, reach out via{" "}
              <a href="mailto:mattjmcguiness@gmail.com">email</a>.
            </p>
          </article>
          <SocialRail />
        </section>

        <section className="welcome-work welcome-card">
          <div className="welcome-work-header">
            <h2 className="welcome-heading">Work</h2>
            <a
              href={resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="welcome-resume-link"
            >
              <span className="codicon codicon-file" aria-hidden="true" />
              Resume
            </a>
          </div>
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
          <p className="welcome-work-footer-note">
            Tap a project above to read its case study.
          </p>
        </section>
      </section>
    </div>
  );
}
