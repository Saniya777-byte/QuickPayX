# QuickPayX – Digital Wallet & Transaction Management System

A full-stack digital wallet and transaction management system designed to simulate secure online money transfers between users. The system focuses on implementing backend financial logic such as balance management, transaction recording, and validation of fund transfers.

## Features

- **User Authentication**: Secure registration and login using JWT-based authentication with password hashing
- **Wallet Management**: Each user is assigned a wallet upon registration
- **Add Funds**: Users can add funds to their wallet (simulated credit operation)
- **Fund Transfer**: Secure transfer of funds between users with balance validation
- **Transaction History**: Track all transactions with details (sender, receiver, amount, timestamp, status)
- **Transaction Validation**: Prevents transfer if sender has insufficient balance or receiver doesn't exist
- **Atomic Transactions**: MongoDB sessions ensure data consistency during transfers

## Tech Stack

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing

### Frontend
- **Next.js** (React framework)
- **TypeScript**
- **Tailwind CSS** for styling

## Project Structure

```
QuickPayX/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── errors/         # Custom error classes
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # Utility functions
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                # Environment variables
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   ├── context/        # Auth context
│   │   ├── services/       # API service
│   │   └── types/          # TypeScript interfaces
│   ├── package.json
│   └── tsconfig.json
├── idea.md                 # Project idea document
├── useCaseDiagram.md       # Use case diagram
├── sequenceDiagram.md      # Sequence diagram
├── classDiagram.md         # Class diagram
└── ErDiagram.md            # ER diagram
```

## Backend Architecture

The backend follows a layered architecture with separation of concerns:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and validation
- **Repositories**: Manage database operations (data access layer)
- **Models**: Define data structures with Mongoose schemas
- **Middleware**: Authentication, validation, and error handling

### OOP Principles Applied

- **Encapsulation**: Data fields are accessed through controlled methods
- **Abstraction**: Business logic is separated from request handling
- **Inheritance**: Custom error classes extend base AppError
- **Polymorphism**: Repository pattern for data access abstraction

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quickpayx
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3005`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Wallet
- `GET /api/wallet` - Get wallet balance (protected)
- `POST /api/wallet/add` - Add funds to wallet (protected)

### Transactions
- `POST /api/transaction/transfer` - Transfer money to another user (protected)
- `GET /api/transaction/history` - Get transaction history (protected)

### User
- `GET /api/user/profile` - Get user profile (protected)

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Wallets Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  balance: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Transactions Collection
```javascript
{
  _id: ObjectId,
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  amount: Number,
  status: String (enum: 'pending', 'completed', 'failed'),
  createdAt: Date,
  updatedAt: Date
}
```

## Key Features Implementation

### Atomic Transactions
The system uses MongoDB sessions to ensure atomic transaction processing:
- Deducts from sender wallet
- Adds to receiver wallet
- Creates transaction record
- All operations are committed together or rolled back on failure

### Input Validation
- Email format validation
- Password length validation (minimum 6 characters)
- Amount validation (must be positive, max 100,000)
- Receiver existence validation
- Balance sufficiency validation

### Error Handling
- Custom error classes for different error types
- Centralized error handler middleware
- Proper HTTP status codes
- User-friendly error messages

## Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Project Documentation

- **idea.md**: Detailed project idea, scope, and key features
- **useCaseDiagram.md**: Use case diagram with Mermaid syntax
- **sequenceDiagram.md**: Sequence diagram showing fund transfer flow
- **classDiagram.md**: Class diagram showing system architecture
- **ErDiagram.md**: ER diagram showing database schema

## License

This project is created for educational purposes as part of the SESD Project Milestone-1.

## Authors

- QuickPayX Development Team