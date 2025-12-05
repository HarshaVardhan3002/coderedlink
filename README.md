# 🔗 CodeRedLink

<div align="center">

![CodeRedLink Banner](https://img.shields.io/badge/CodeRedLink-URL%20Shortener-gradient?style=for-the-badge&logo=link&logoColor=white)

**A modern, beautiful URL shortener with real-time analytics**

[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](#) · [Report Bug](https://github.com/HarshaVardhan3002/coderedlink/issues) · [Request Feature](https://github.com/HarshaVardhan3002/coderedlink/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About The Project

CodeRedLink is a sleek, modern URL shortening service built with cutting-edge web technologies. It features a stunning **Apple Vision-inspired liquid glass UI** with smooth animations, real-time click analytics, and a responsive design that works beautifully on all devices.

### Why CodeRedLink?

- **Beautiful Design**: Premium glassmorphism aesthetic that stands out
- **Lightning Fast**: Built on Next.js 16 with Turbopack for instant page loads
- **Real-time Analytics**: Track clicks, unique visitors, and traffic patterns
- **Developer Friendly**: Clean codebase with TypeScript and Prisma
- **Production Ready**: Optimized for Vercel deployment with Neon PostgreSQL

---

## ✨ Features

### Core Functionality
| Feature | Description |
|---------|-------------|
| 🔗 **URL Shortening** | Create short, memorable links with custom codes (4-8 characters) |
| 📊 **Click Analytics** | Track total clicks, unique visitors, and referrer data |
| 📈 **Traffic Charts** | Visual representation of clicks over time with Recharts |
| 🔄 **Auto-refresh** | Stats page updates automatically every 30 seconds |
| 📋 **One-click Copy** | Instantly copy shortened URLs to clipboard |

### User Experience
| Feature | Description |
|---------|-------------|
| 🌓 **Dark/Light Mode** | Automatic theme switching with manual toggle |
| 📱 **Fully Responsive** | Optimized for mobile, tablet, and desktop |
| ⚡ **Instant Feedback** | Toast notifications for all actions |
| 🔍 **Search & Filter** | Quickly find links by code or target URL |
| 🗑️ **Soft Delete** | Safely remove links with confirmation dialog |

### Design
| Feature | Description |
|---------|-------------|
| 🎨 **Glassmorphism** | Frosted glass effects with backdrop blur |
| ✨ **Smooth Animations** | Framer Motion powered transitions |
| 🎭 **Modern Typography** | Inter font with refined spacing |
| 🌈 **Subtle Gradients** | Premium color palettes for light/dark modes |

---

## 🛠 Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Recharts](https://recharts.org/)** - Charting library for analytics

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/app/api-reference)** - Serverless functions
- **[Prisma ORM](https://www.prisma.io/)** - Type-safe database client
- **[Neon PostgreSQL](https://neon.tech/)** - Serverless Postgres database

### UI Components
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled accessible components
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library
- **[Lucide Icons](https://lucide.dev/)** - Modern icon set
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Form & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Performant form handling
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **pnpm** - Package manager
- **Neon Account** - [Sign up free](https://neon.tech/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarshaVardhan3002/coderedlink.git
   cd coderedlink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Neon database URL:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
   ```

4. **Push database schema**
   ```bash
   npx prisma db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   
   Visit [http://localhost:3000](http://localhost:3000)

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma db push` | Push schema changes to database |

---

## 📁 Project Structure

```
coderedlink/
├── 📁 prisma/
│   └── schema.prisma        # Database schema (Link, Click models)
│
├── 📁 public/
│   └── favicon.ico          # App favicon
│
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 [code]/       # Dynamic redirect route
│   │   │   └── route.ts     # Handles /:code redirects
│   │   │
│   │   ├── 📁 api/
│   │   │   └── 📁 links/
│   │   │       ├── route.ts          # GET/POST /api/links
│   │   │       └── 📁 [code]/
│   │   │           └── route.ts      # GET/DELETE /api/links/:code
│   │   │
│   │   ├── 📁 code/
│   │   │   └── 📁 [code]/
│   │   │       └── page.tsx  # Stats page for each link
│   │   │
│   │   ├── globals.css       # Global styles & theme
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Homepage with URL shortener
│   │   └── not-found.tsx     # 404 page
│   │
│   ├── 📁 components/
│   │   ├── 📁 ui/            # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   │
│   │   ├── Navbar.tsx        # Navigation bar with theme toggle
│   │   └── theme-provider.tsx # Dark/light mode provider
│   │
│   └── 📁 lib/
│       ├── prisma.ts         # Prisma client singleton
│       ├── utils.ts          # Utility functions (cn helper)
│       └── validations.ts    # Zod schemas
│
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── components.json           # shadcn/ui config
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies & scripts
├── postcss.config.mjs        # PostCSS config
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript config
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Create Short Link
```http
POST /api/links
Content-Type: application/json

{
  "url": "https://example.com/very-long-url",
  "code": "mycode"  // Optional, 4-8 alphanumeric chars
}
```

**Response (201 Created)**
```json
{
  "id": "clxxx...",
  "code": "mycode",
  "targetUrl": "https://example.com/very-long-url",
  "totalClicks": 0,
  "createdAt": "2024-12-05T12:00:00.000Z"
}
```

#### Get All Links
```http
GET /api/links
```

**Response (200 OK)**
```json
[
  {
    "id": "clxxx...",
    "code": "abc123",
    "targetUrl": "https://example.com",
    "totalClicks": 42,
    "lastClickedAt": "2024-12-05T15:30:00.000Z",
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
]
```

#### Get Link Stats
```http
GET /api/links/:code
```

**Response (200 OK)**
```json
{
  "id": "clxxx...",
  "code": "abc123",
  "targetUrl": "https://example.com",
  "totalClicks": 42,
  "clicks": [
    {
      "id": "clyyy...",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "referer": "https://google.com",
      "createdAt": "2024-12-05T15:30:00.000Z"
    }
  ]
}
```

#### Delete Link
```http
DELETE /api/links/:code
```

**Response (200 OK)**
```json
{
  "message": "Link deleted"
}
```

#### Redirect (Short URL)
```http
GET /:code
```

**Response**: 307 Temporary Redirect to target URL

---

## 🗃 Database Schema

### Link Model
| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique identifier (CUID) |
| `code` | String | Short code (unique, indexed) |
| `targetUrl` | String | Original long URL |
| `totalClicks` | Int | Click counter |
| `lastClickedAt` | DateTime? | Last click timestamp |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |
| `deletedAt` | DateTime? | Soft delete timestamp |
| `userId` | String? | Owner user ID (optional) |

### Click Model
| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique identifier (CUID) |
| `linkId` | String | Foreign key to Link |
| `ipAddress` | String? | Visitor IP address |
| `userAgent` | String? | Browser/device info |
| `referer` | String? | Referring URL |
| `createdAt` | DateTime | Click timestamp |

---

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment**
   - Add `DATABASE_URL` environment variable
   - Use your Neon connection string

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in ~60 seconds!

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by [Harsha Vardhan](https://github.com/HarshaVardhan3002)**

⭐ Star this repo if you find it useful!

</div>
