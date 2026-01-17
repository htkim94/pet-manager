---
name: Express Backend Redis Session
overview: Set up a Node.js Express backend with TypeScript in the existing `backend/` folder, using PostgreSQL for data and Redis for session storage. Includes session-cookie based authentication to support the frontend auth pages.
todos:
  - id: init-backend
    content: Create package.json and tsconfig.json, install dependencies
    status: completed
  - id: db-config
    content: Create PostgreSQL connection pool (config/db.ts) and schema.sql
    status: completed
  - id: redis-config
    content: Create Redis client configuration (config/redis.ts)
    status: completed
  - id: express-setup
    content: Set up Express server with middleware (cors, json, redis session, error handler)
    status: completed
  - id: auth-endpoints
    content: Implement auth routes and controller (register, login, logout, me, forgot/reset password)
    status: completed
  - id: session-middleware
    content: Create session authentication middleware for protected routes
    status: completed
  - id: env-example
    content: Create .env.example with required environment variables
    status: completed
---

# Express Backend Server with Redis Session Storage

## Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Entry point, Express app
│   ├── config/
│   │   ├── db.ts                # PostgreSQL connection pool
│   │   └── redis.ts             # Redis client
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   └── auth.ts              # Auth routes
│   ├── controllers/
│   │   └── authController.ts    # Auth logic
│   ├── middleware/
│   │   ├── errorHandler.ts      # Global error handling
│   │   └── authenticate.ts      # Session verification
│   └── types/
│       └── index.ts             # TypeScript types
├── sql/
│   └── schema.sql               # Database schema
├── package.json
├── tsconfig.json
└── .env.example
```

## Dependencies

**Runtime:**

- `express` - Web framework
- `express-session` - Session management
- `connect-redis` - Redis session store
- `ioredis` - Redis client (better TypeScript support than `redis`)
- `pg` - PostgreSQL driver
- `bcrypt` - Password hashing
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

**Dev:**

- `typescript`, `@types/*` - TypeScript support
- `ts-node-dev` - Hot reload for development

## Database Schema ([backend/sql/schema.sql](backend/sql/schema.sql))

PostgreSQL for user data only (sessions stored in Redis):

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

- `POST /api/auth/register` - Create new user, auto-login (sets session cookie)
- `POST /api/auth/login` - Login (sets session cookie)
- `POST /api/auth/logout` - Logout (destroys session)
- `GET /api/auth/me` - Get current user (from session)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

## Key Implementation Details

- **Sessions**: `express-session` with `connect-redis` for Redis storage
- **Redis client**: `ioredis` for better TypeScript support and performance
- **Cookie settings**: httpOnly, secure (in production), sameSite: 'lax'
- **Passwords**: bcrypt with 10 salt rounds
- **CORS**: Allow `http://localhost:5173` with `credentials: true`
- **Auth middleware**: Check `req.session.userId` for protected routes

## Scripts (package.json)

```json
{
  "dev": "ts-node-dev --respawn src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

## Environment Variables (.env.example)

```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/pet_manager
REDIS_URL=redis://localhost:6379
SESSION_SECRET=your-session-secret
NODE_ENV=development
```