# CodeRedLink

A futuristic AR-era URL shortening platform built with Next.js, TypeScript, Tailwind CSS, and Neon Postgres.

## Features

- **Liquid Glass + Neon UI**: Immersive, responsive design with glassmorphism and neon accents.
- **URL Shortening**: Create short links with optional custom codes.
- **Analytics**: Track total clicks and last click time.
- **Soft Delete**: Remove links without losing data permanently.
- **API First**: Full REST API for all operations.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + ShadCN UI
- **Database**: Neon Postgres + Prisma ORM
- **Validation**: Zod + React Hook Form
- **Animation**: Framer Motion

## Getting Started

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and add your Neon Postgres connection string.
   ```bash
   cp .env.example .env
   ```

4. **Run Database Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

The project is ready for deployment on Vercel.

1. Push to GitHub.
2. Import project in Vercel.
3. Add `DATABASE_URL` environment variable.
4. Deploy.

## API Documentation

- `POST /api/links`: Create a new link.
- `GET /api/links`: List all links.
- `GET /api/links/[code]`: Get link details.
- `DELETE /api/links/[code]`: Soft delete a link.
