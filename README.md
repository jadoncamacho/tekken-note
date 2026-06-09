This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Tekken Notes
Tekken Notes is a web application that serves as a resource for Tekken 8 frame data and allows personal note-taking on individual character moves.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Next.js 16** (App Router) — full-stack React framework; handles routing, server components, server actions, and API endpoints
- **React 19** — UI rendering
- **TypeScript** — static typing across the entire codebase
- **Tailwind CSS v4** — utility-first styling
- **NextAuth v5** — authentication (credentials-based email/password login, JWT sessions)
- **bcryptjs** — password hashing
- **Prisma ORM** — schema definition, migrations, and type-safe database client
- **SQLite** (via `better-sqlite3`) — local single-file database
- **Cheerio** — HTML scraping used to seed Tekken 8 frame data

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


