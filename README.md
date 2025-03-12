DadChat

A forum application built for dads to connect, share experiences, and support each other. Built with Next.js, TypeScript, Prisma, and NextAuth.js.

## Features

- 🔐 User authentication with email/password
- 📝 Create and manage posts
- 🗂️ Organized categories for different topics
- 👍 Voting system for posts
- 💬 Commenting system (coming soon)
- 🎨 Modern UI with Tailwind CSS and Shadcn UI

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Auth:** NextAuth.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Form Handling:** React Hook Form
- **Validation:** Zod

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mattykrant/dadchat.git
   cd dadchat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the environment variables in `.env` with your configuration

5. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## Database Schema

The application uses the following main models:
- User
- Category
- Post
- Comment
- Vote

## Deployment

The application can be deployed on Vercel:

1. Create a Vercel account
2. Install Vercel CLI: `npm i -g vercel`
3. Deploy: `vercel`

Remember to set up the following environment variables in your Vercel project:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
