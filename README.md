# Website

VS Code-inspired portfolio experience built with React + Vite.

## Run

```bash
npm install
npm run server   # terminal 1 (OpenRouter proxy)
npm run dev      # terminal 2 (Vite app)
```

## Environment

Copy `.env.example` to `.env.local` and set values:

```bash
OPENROUTER_API_KEY=your_key
```

Optional:

```bash
OPENROUTER_MODEL=google/gemini-2.5-flash-lite
OPENROUTER_MODEL_FALLBACKS=z-ai/glm-4.7-flash,qwen/qwen3-next-80b-a3b-instruct,moonshotai/kimi-k2.5
OPENROUTER_REPAIR_MODEL=google/gemini-2.5-flash-lite
OPENROUTER_MAX_TOKENS=1100
OPENROUTER_TEMPERATURE=0.85
OPENROUTER_TRANSCRIPT_TURNS=12
OPENROUTER_TRANSCRIPT_CHARS=900
OPENROUTER_PROVIDER_SORT=throughput
OPENROUTER_PROVIDER_PARTITION=none
OPENROUTER_PROVIDER_MIN_THROUGHPUT=18
OPENROUTER_PROVIDER_MAX_LATENCY=8
OREGON_PROXY_PORT=8787
VITE_GITHUB_TOKEN=your_token_here
```

## GitHub API 403s

This app loads repositories directly from the GitHub API in the browser.
Unauthenticated requests are rate-limited and can return `403`.

To raise the limit, set a token in `.env.local`:

```bash
VITE_GITHUB_TOKEN=your_token_here
```

Then restart the dev server.
