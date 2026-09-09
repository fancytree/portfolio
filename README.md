This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Analytics

PostHog is initialized in `src/instrumentation-client.ts`. Page views, client-side route changes, clicks, web vitals, and session replay are collected according to the active PostHog project settings.

All portfolio events include `app = portfolio-site`, so they can be filtered separately when the PostHog project also contains data from other products.

Set the following variables in `.env.local` and in the deployment environment:

```bash
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
NEXT_PUBLIC_POSTHOG_UI_HOST=https://eu.posthog.com
```

Browser traffic is sent through the same-origin `/hzn` rewrite configured in
`next.config.ts`, which reduces blocking by privacy extensions. The rewrite
uses the configured PostHog host and derives its matching assets host.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# portfolio
