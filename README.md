# Website

VS Code-inspired portfolio experience built with React + Vite.

## Run

```bash
npm install
npm run dev
```

## GitHub API 403s

This app loads repositories directly from the GitHub API in the browser.
Unauthenticated requests are rate-limited and can return `403`.

To raise the limit, set a token in `.env.local`:

```bash
VITE_GITHUB_TOKEN=your_token_here
```

Then restart the dev server.
