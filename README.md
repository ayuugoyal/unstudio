# UnStudio

This repository houses a robust Next.js application seamlessly integrated with PostgreSQL using the Prisma ORM. It features secure user authentication via next-auth with OAuth options from Google and GitHub.

## Getting Started

To deploy a local instance of the project, follow these straightforward steps:

### Prerequisites

Ensure Node.js and npm (or yarn, pnpm) are installed on your workstation.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ayuugoyal/unstudio.git
   ```
2. Navigate to the project directory:
   ```bash
   cd unstudio
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn
   ```

### Configuration

#### PostgreSQL and Prisma Setup

1. Set up a PostgreSQL database.
2. Configure your database connection in the `.env` file:

   ```dotenv
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   AUTH_SECRET="your_auth_secret_here"
   GITHUB_CLIENT_ID="your_github_client_id_here"
   GITHUB_CLIENT_SECRET="your_github_client_secret_here"
   CLOUDINARY_API_KEY="your_cloudinary_api_key_here"
   CLOUDINARY_API_SECRET="your_cloudinary_api_secret_here"
   CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name_here"
   GOOGLE_CLIENT_ID="your_google_client_id_here"
   GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
   ```

3. Migrate the database using Prisma:
   ```bash
   npx prisma migrate dev
   ```

#### next-auth Setup (GitHub Login)

1. Create a GitHub Developer Project and configure OAuth credentials.
2. Update `next.config.js` with GitHub OAuth details.

#### next-auth Setup (Google Login)

1. Create a Google Developer Project and configure OAuth credentials.
2. Update `next.config.js` with Google OAuth details.

### Running the Application

Initiate the Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm run dev
```

Access the application via `http://localhost:3000`.

## Features

- **PostgreSQL Database:** Leveraging Prisma ORM for optimized database operations.
- **User Authentication:** Implemented securely using next-auth with Google & GitHub OAuth.
- **Next.js Framework:** Utilizing Next.js for efficient server-side rendering and enhanced performance.

Explore the deployed application at [https://unstudio-ai.vercel.app/](https://unstudio-ai.vercel.app/).
