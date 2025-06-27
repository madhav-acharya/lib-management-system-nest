# Library Management System Backend

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="80" alt="NestJS" />
  <img src="https://www.vectorlogo.zone/logos/prismaio/prismaio-icon.svg" width="50" alt="Prisma" />
  <img src="https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg" width="60" alt="PostgreSQL" />
  <img src="https://www.vectorlogo.zone/logos/docker/docker-icon.svg" width="60" alt="Docker" />
</p>

<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://img.shields.io/badge/NestJS-Backend-red.svg?logo=nestjs" alt="NestJS" />
  </a>
  <a href="https://www.prisma.io/" target="_blank">
    <img src="https://img.shields.io/badge/Prisma-ORM-blue.svg?logo=prisma" alt="Prisma" />
  </a>
  <a href="https://www.postgresql.org/" target="_blank">
    <img src="https://img.shields.io/badge/PostgreSQL-Database-316192.svg?logo=postgresql" alt="PostgreSQL" />
  </a>
  <a href="https://jwt.io/" target="_blank">
    <img src="https://img.shields.io/badge/JWT-Authentication-black.svg?logo=jsonwebtokens" alt="JWT" />
  </a>
</p>

A comprehensive library management system backend built with NestJS, Prisma ORM, and PostgreSQL. This system provides complete functionality for managing users, library members, books, and transaction operations with role-based authentication and automated overdue tracking.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Docker Setup](#docker-setup)
- [Project Structure](#project-structure)

## Features

- JWT-based Authentication and Authorization
- Role-based Access Control (ADMIN, SUPERADMIN)
- User Management
- Library Member Management
- Book Inventory Management
- Transaction Management (Borrow/Return/Overdue)
- Automated Overdue Status Updates with Cron Jobs
- Input Validation and Error Handling
- PostgreSQL Database with Prisma ORM
- RESTful API Design

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator
- **Password Hashing**: bcrypt
- **Scheduling**: @nestjs/schedule
- **Language**: TypeScript

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Docker (optional)

### Clone Repository

```bash
git clone https://github.com/madhav-acharya/lib-management-system-nest.git
cd lib-management-system/backend
```

### Install Dependencies

```bash
npm install
```

## Environment Setup

Create a `.env` file in the backend directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/library_db"

# Server
PORT=3000

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
```

## Database Setup

### Generate Prisma Client

```bash
npm run generate
```

### Run Database Migrations

```bash
npx prisma migrate deploy
```

### View Database (Optional)

```bash
npx prisma studio
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/login` | User login | Public |

**Login Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Users Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/users/add` | Create new user | SUPERADMIN |
| GET | `/users/getAll` | Get all users | Authenticated |
| GET | `/users/get/:email` | Get user by email | Authenticated |
| DELETE | `/users/delete/:id` | Delete user | Authenticated |

**Create User Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "ADMIN",
  "phoneNumber": "1234567890",
  "address": "123 Main St"
}
```

### Books Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/books/add` | Add new book | Authenticated |
| GET | `/books/getAll` | Get all books | Authenticated |

**Add Book Request Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "totalCopies": 10,
  "available": 10
}
```

### Members Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/members/add` | Add new member | Authenticated |
| GET | `/members/getAll` | Get all members | Authenticated |
| DELETE | `/members/delete/:id` | Delete member | Authenticated |

**Add Member Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phoneNumber": "0987654321",
  "address": "456 Oak Ave"
}
```

### Transactions Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/transactions/generate` | Create new transaction | Authenticated |
| GET | `/transactions/get` | Get all transactions | Authenticated |
| PATCH | `/transactions/update/:id` | Update transaction status | Authenticated |

**Create Transaction Request Body:**
```json
{
  "bookId": 1,
  "memberId": 1,
  "status": "BORROWED",
  "returnDate": "2025-07-15T00:00:00.000Z"
}
```

**Update Transaction Status Request Body:**
```json
{
  "status": "RETURNED"
}
```

## Authentication

### JWT Token

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Role-Based Access

- **ADMIN**: Can manage books, members, and transactions
- **SUPERADMIN**: Can manage users + all ADMIN permissions

## Database Schema

### User Model
```prisma
model User {
  id          Int           @id @default(autoincrement())
  name        String
  email       String        @unique()
  phoneNumber String        @unique()
  address     String
  role        Role          @default(ADMIN)
  password    String
  createdAt   DateTime      @default(now())
  Member      Member[]
  Book        Book[]
  Transaction Transaction[]
}
```

### Member Model
```prisma
model Member {
  id          Int           @id @default(autoincrement())
  userId      Int
  user        User          @relation(fields: [userId], references: [id])
  name        String
  email       String
  phoneNumber String
  address     String
  createdAt   DateTime      @default(now())
  Transaction Transaction[]
}
```

### Book Model
```prisma
model Book {
  id          Int           @id @default(autoincrement())
  userId      Int
  user        User          @relation(fields: [userId], references: [id])
  author      String
  title       String
  totalCopies Int
  available   Int
  createdAt   DateTime      @default(now())
  Transaction Transaction[]
}
```

### Transaction Model
```prisma
model Transaction {
  id         Int               @id @default(autoincrement())
  bookId     Int
  book       Book              @relation(fields: [bookId], references: [id])
  memberId   Int
  member     Member            @relation(fields: [memberId], references: [id])
  userId     Int
  user       User              @relation(fields: [userId], references: [id])
  status     TransactionStatus @default(BORROWED)
  returnDate DateTime?
  createdAt  DateTime          @default(now())
}
```

## Testing

### Unit Tests
```bash
npm run test
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

### Manual Testing with cURL

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

#### Add Book (with token)
```bash
curl -X POST http://localhost:3000/books/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "totalCopies": 5,
    "available": 5
  }'
```

#### Create Transaction
```bash
curl -X POST http://localhost:3000/transactions/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "bookId": 1,
    "memberId": 1,
    "returnDate": "2025-07-15T00:00:00.000Z"
  }'
```

## Docker Setup

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: library_user
      POSTGRES_PASSWORD: library_pass
      POSTGRES_DB: library_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://library_user:library_pass@postgres:5432/library_db
      JWT_SECRET: your-super-secret-jwt-key
    depends_on:
      - postgres
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  postgres_data:
```

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

### Run with Docker

```bash
docker-compose up --build
```

## Project Structure

```
backend/
├── prisma/
│   ├── migrations/          # Database migrations
│   ├── schema.prisma       # Database schema
│   ├── prisma.module.ts    # Prisma module
│   └── prisma.service.ts   # Prisma service
├── src/
│   ├── auth/               # Authentication module
│   │   ├── dto/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── jwt.strategy.ts
│   │   ├── roles.decorator.ts
│   │   └── roles.guard.ts
│   ├── books/              # Books module
│   │   ├── dto/
│   │   ├── books.controller.ts
│   │   ├── books.service.ts
│   │   └── books.module.ts
│   ├── members/            # Members module
│   │   ├── dto/
│   │   ├── members.controller.ts
│   │   ├── members.service.ts
│   │   └── members.module.ts
│   ├── transactions/       # Transactions module
│   │   ├── dto/
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   └── transactions.module.ts
│   ├── users/              # Users module
│   │   ├── dto/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── enums/              # Enum definitions
│   ├── interfaces/         # TypeScript interfaces
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/                   # Test files
├── package.json
├── tsconfig.json
└── README.md
```

## Business Rules

1. **Transaction Limits**: Members can have maximum 6 active (non-returned) transactions
2. **Book Availability**: Books can only be borrowed if available copies > 0
3. **Overdue Management**: Automated daily cron job updates overdue transactions
4. **Role Permissions**: Only SUPERADMIN can create users
5. **User Association**: All entities (books, members, transactions) are associated with users

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
