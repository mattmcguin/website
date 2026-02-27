import { useEffect, useState } from "react";

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

const booksRead = [
  { title: "Runnin' Down a Dream", author: "Bill Gurley", coverSrc: "https://images1.penguinrandomhouse.com/cover/700jpg/9780593799666" },
  { title: "Iron Gold", author: "Pierce Brown", coverSrc: "https://covers.openlibrary.org/b/id/14511722-M.jpg" },
  { title: "Frankenstein (1818)", author: "Mary Shelley", coverSrc: "https://covers.openlibrary.org/b/id/7267770-M.jpg" },
  { title: "Empire of Silence", author: "Christopher Ruocchio", coverSrc: "https://covers.openlibrary.org/b/id/13278787-M.jpg" },
  { title: "God Emperor of Dune", author: "Frank Herbert", coverSrc: "https://covers.openlibrary.org/b/id/6711531-M.jpg" },
  { title: "The Strength of the Few", author: "James Islington", coverSrc: "https://covers.openlibrary.org/b/id/15150800-M.jpg" },
  { title: "The Will of the Many", author: "James Islington", coverSrc: "https://covers.openlibrary.org/b/id/15149934-M.jpg" },
  { title: "Last Argument of Kings", author: "Joe Abercrombie", coverSrc: "https://covers.openlibrary.org/b/id/6901175-M.jpg" },
  { title: "Before They Are Hanged", author: "Joe Abercrombie", coverSrc: "https://covers.openlibrary.org/b/id/14595640-M.jpg" },
  { title: "The Blade Itself", author: "Joe Abercrombie", coverSrc: "https://covers.openlibrary.org/b/id/14543422-M.jpg" },
  { title: "AI 2041", author: "Kai-Fu Lee and Chen Qiufan", coverSrc: "https://covers.openlibrary.org/b/id/11101676-M.jpg" },
  { title: "Demon Copperhead", author: "Barbara Kingsolver", coverSrc: "https://covers.openlibrary.org/b/id/13141227-M.jpg" },
  { title: "Morning Star", author: "Pierce Brown", coverSrc: "https://covers.openlibrary.org/b/id/8566174-M.jpg" },
  { title: "Golden Son", author: "Pierce Brown", coverSrc: "https://covers.openlibrary.org/b/id/8454351-M.jpg" },
  { title: "Red Rising", author: "Pierce Brown", coverSrc: "https://covers.openlibrary.org/b/id/7316188-M.jpg" },
  { title: "Jurassic Park", author: "Michael Crichton", coverSrc: "https://covers.openlibrary.org/b/id/12882940-M.jpg" },
  { title: "The Martian", author: "Andy Weir", coverSrc: "https://covers.openlibrary.org/b/id/11447888-M.jpg" },
  { title: "A Court of Thorns and Roses", author: "Sarah J. Maas", coverSrc: "https://covers.openlibrary.org/b/id/8738585-M.jpg" },
  { title: "The Founders", author: "Jimmy Soni", coverSrc: null },
  { title: "Becoming Steve Jobs", author: "Brent Schlender and Rick Tetzeli", coverSrc: "https://covers.openlibrary.org/b/id/8191112-M.jpg" },
  { title: "Children of Dune", author: "Frank Herbert", coverSrc: "https://covers.openlibrary.org/b/id/6976407-M.jpg" },
  { title: "Dune Messiah", author: "Frank Herbert", coverSrc: "https://covers.openlibrary.org/b/id/2421405-M.jpg" },
  { title: "Dune", author: "Frank Herbert", coverSrc: "https://covers.openlibrary.org/b/id/11481354-M.jpg" },
  { title: "The Three-Body Problem", author: "Liu Cixin", coverSrc: "https://covers.openlibrary.org/b/id/10526598-M.jpg" },
  { title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", coverSrc: "https://covers.openlibrary.org/b/id/14848877-M.jpg" },
  { title: "Rendezvous with Rama", author: "Arthur C. Clarke", coverSrc: "https://covers.openlibrary.org/b/id/13472608-M.jpg" },
  { title: "Children of Time", author: "Adrian Tchaikovsky", coverSrc: "https://covers.openlibrary.org/b/id/8264706-M.jpg" },
  { title: "Project Hail Mary", author: "Andy Weir", coverSrc: "https://covers.openlibrary.org/b/id/11200092-M.jpg" },
  { title: "Nexus", author: "Ramez Naam", coverSrc: "https://covers.openlibrary.org/b/id/7261361-M.jpg" },
  { title: "Avogadro Corp", author: "William Hertling", coverSrc: "https://covers.openlibrary.org/b/id/7246548-M.jpg" },
  { title: "Recursion", author: "Blake Crouch", coverSrc: "https://covers.openlibrary.org/b/id/8748478-M.jpg" },
  { title: "Man's Search for Meaning", author: "Viktor E. Frankl", coverSrc: "https://covers.openlibrary.org/b/id/465226-M.jpg" },
  { title: "The Top Five Regrets of the Dying", author: "Bronnie Ware", coverSrc: "https://covers.openlibrary.org/b/id/9071458-M.jpg" },
  { title: "The Diamond Age", author: "Neal Stephenson", coverSrc: "https://covers.openlibrary.org/b/id/8598269-M.jpg" },
  { title: "Snow Crash", author: "Neal Stephenson", coverSrc: "https://covers.openlibrary.org/b/id/392508-M.jpg" },
  { title: "Dark Matter", author: "Blake Crouch", coverSrc: "https://covers.openlibrary.org/b/id/7436634-M.jpg" },
];

const BOOK_COVER_PLACEHOLDER_SRC = "/images/books/placeholder-cover.svg";

function escapeSvgText(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createBookCover(title, author, index) {
  const hue = (index * 29 + 31) % 360;
  const accentHue = (hue + 34) % 360;
  const safeTitle = escapeSvgText(title);
  const safeAuthor = escapeSvgText(author);

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="270" viewBox="0 0 180 270">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="hsl(${hue} 61% 35%)" />
          <stop offset="100%" stop-color="hsl(${accentHue} 64% 24%)" />
        </linearGradient>
      </defs>
      <rect width="180" height="270" rx="12" fill="url(#bg)" />
      <rect x="14" y="14" width="152" height="242" rx="8" fill="rgba(0,0,0,0.14)" stroke="rgba(255,255,255,0.2)" />
      <text x="24" y="64" font-size="14" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-weight="700" fill="white">${safeTitle}</text>
      <text x="24" y="228" font-size="10" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" fill="rgba(255,255,255,0.9)">${safeAuthor}</text>
    </svg>`
  )}`;
}

function getBookKey(book) {
  return `${book.title}::${book.author}`;
}

const booksReadWithCovers = booksRead.map((book, index) => ({
  ...book,
  key: getBookKey(book),
  fallbackCoverSrc: createBookCover(book.title, book.author, index),
}));

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

function BookCover({ src, fallbackSrc, alt, className }) {
  const [currentSrc, setCurrentSrc] = useState(
    src || fallbackSrc || BOOK_COVER_PLACEHOLDER_SRC
  );

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc || BOOK_COVER_PLACEHOLDER_SRC);
  }, [src, fallbackSrc]);

  function handleError() {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    if (currentSrc !== BOOK_COVER_PLACEHOLDER_SRC) {
      setCurrentSrc(BOOK_COVER_PLACEHOLDER_SRC);
    }
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
    />
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

        <section className="welcome-library welcome-card">
          <div className="welcome-library-header">
            <h2 className="welcome-heading">Library</h2>
            <span className="welcome-library-count">
              {booksReadWithCovers.length} books
            </span>
          </div>
          <ul className="welcome-library-list">
            {booksReadWithCovers.map((book) => (
              <li key={book.key}>
                <article className="welcome-library-row">
                  <BookCover
                    src={book.coverSrc}
                    fallbackSrc={book.fallbackCoverSrc}
                    alt={`Cover for ${book.title}`}
                    className="welcome-library-cover"
                  />
                  <div className="welcome-library-meta">
                    <strong className="welcome-library-title">{book.title}</strong>
                    <span className="welcome-library-author">{book.author}</span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
}
