# Creator Studio

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)

Portfolio-style web app with auth, dashboard, contact page, and media upload workflow.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Main Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Clerk authentication
- Cloudinary signed upload endpoint

## Project Structure

- `app/` — routes, API handlers, page composition
- `app/components/` — reusable UI components
- `app/api/cloudinary/sign/route.ts` — upload signature endpoint
- `public/projects/` — project/media assets
