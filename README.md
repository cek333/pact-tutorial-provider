# Cy, Node template

A template with tooling, configuration and best practices for a Cy api e2e testing in a Node.js project.

## Setup

```bash
npm i
```

Use the sample `.env.example` file to create a `.env` file of your own. These values will also have to exist in your CI secrets.

```bash
PORT=3001
```

### Scripts

```bash
npm run lint
npm run typecheck
npm run fix:format
npm run validate # all the above in parallel

npm run test # unit tests
npm run test:watch # watch mode

npm run mock:server # starts the mock backend/provider server

npm run cy:open-local # open mode
npm run cy:run-local  # run mode
npm run cy:run-local-fast  # no video or screen shots
```

## ESM Config (recommended in prisma docs)
Update `tsconfig.json` for ESM compatibility:
```
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ES2023",
    "strict": true,
    "esModuleInterop": true,
    "ignoreDeprecations": "6.0"
  }
}
```
Update `package.json` to enable ESM:
```
{
  "type": "module",
}
```

## PRISMA SETUP
npx prisma init

Initialized Prisma in your project

```
  prisma/
    schema.prisma
  prisma.config.ts
```

Next, choose how you want to set up your database:

CONNECT EXISTING DATABASE:
  1. Configure your DATABASE_URL in prisma.config.ts
  2. Run prisma db pull to introspect your database.

CREATE NEW DATABASE:
  Local: npx prisma dev (runs Postgres locally in your terminal)
  Cloud: npx create-db (creates a free Prisma Postgres database)

Then, define your models in prisma/schema.prisma and run prisma migrate dev to apply your schema.

If prisma/schema.prisma changes re-run:
```
npm run db:migrate
npm run db:sync
npm run reset:db

In package.json add:
  "db:migrate": "npx prisma migrate reset --force --skip-seed generate",
  "db:sync": "npx prisma db push --force-reset && npx prisma generate",
  "reset:db": "tsx ./scripts/global-setup.ts",
```

Additional notes from: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/sqlite

npm install prisma @types/node @types/better-sqlite3 --save-dev 
npm install @prisma/client @prisma/adapter-better-sqlite3 dotenv

Run `npx prisma format` to format `prisma/schema.prisma`.
After setting up `prisma/schema.prisma`, run `npx prisma migrate dev` to create the sqlite db file.

Next, generate the prisma client: `npx prisma generate`

Now use the prisma client:
```
import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
```