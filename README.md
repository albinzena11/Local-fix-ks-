# Local-FIX 🛠️

A professional SaaS marketplace platform connecting clients with specialized service providers. This project features a robust multi-language system, secure authentication, and a complete job management lifecycle.

## 🚀 Features
- **Multi-language Support**: Fully localized in English, Albanian, and German using `next-intl`.
- **Advanced Auth**: Role-based access control (RBAC) with NextAuth.js.
- **Service Marketplace**: Advanced filtering and search for professionals and products.
- **Job Flow**: Multi-step request creation, bidding system, and job tracking.
- **Professional Dashboards**: Dedicated views for both Clients and Service Providers.
- **Real-time System**: Integrated notifications and internal messaging.

## 💻 Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with dark mode support.
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/).
- **Auth**: [NextAuth.js](https://next-auth.js.org/).
- **Translations**: [next-intl](https://next-intl-docs.vercel.app/).

## 🛠️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Copy `.env.example` to `.env` and fill in your credentials.
   ```bash
   cp .env.example .env
   ```

3. **Database Migration**:
   ```bash
   npx prisma db push
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
