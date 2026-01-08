# Invoice Manager

A modern, full-stack invoice management application built with Next.js, featuring multi-language support, theme switching, and robust data management.

## 🏗️ Architecture

The application follows a modular architecture designed for scalability and maintainability.

### Tech Stack
- **Frontend/Backend**: [Next.js](https://nextjs.org) (App Router)
- **Database ORM**: [Prisma](https://www.prisma.io)
- **Database**: PostgreSQL (hosted on localhost:5432)
- **Authentication**: [NextAuth.js](https://next-auth.js.org)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Styling**: Tailwind CSS / Vanilla CSS

### Project Structure
- `prisma/`: Database schema and migrations.
- `src/app/`: Next.js pages, layouts, and API routes. Includes localized routes via `[locale]`.
- `src/components/`: Reusable React components (UI elements, forms, charts).
- `src/i18n/`: Internationalization configuration and messages.
- `src/lib/`: Core logic and utilities.
  - `actions.ts`: Next.js Server Actions for handling form submissions and data mutations.
  - `services/`: Business logic layer. Communicates directly with Prisma to interact with the database.
  - `types/`: TypeScript interface definitions for application data models.
  - `prisma.ts`: Singleton instance of the Prisma Client.
- `src/middleware.ts`: Handles authentication and localization routing.

### Data Flow
1. **User Interaction**: User interacts with a React component (e.g., `InvoiceForm`).
2. **Server Action**: The component calls a Server Action (in `actions.ts`) to process input.
3. **Service Layer**: The Server Action invokes a function from the Service Layer (in `services/`) to perform business logic.
4. **Database Interaction**: The Service uses Prisma to query or update the PostgreSQL database.
5. **UI Update**: The Server Action returns the result, and Next.js revalidates the data to update the UI.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   The application uses environment variables for database connection and authentication.
   
   - Copy the template file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and fill in the following variables:
     - `DATABASE_URL`: Your PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/invoice_db`).
     - `NEXTAUTH_SECRET`: A random string used to hash tokens and sign cookies. You can generate one using `openssl rand -base64 32`.
     - `NEXTAUTH_URL`: (Optional for local dev) The base URL of your application (usually `http://localhost:3000`).

3. **Database Setup**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🧪 Testing

Run unit tests with Vitest:
```bash
npm test
```

