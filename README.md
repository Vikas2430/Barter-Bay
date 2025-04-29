# BarterBay - Modern Bartering Platform

BarterBay is a modern web application that facilitates bartering between users. It provides a platform where users can exchange goods and services without the need for traditional currency.

## Tech Stack

### Frontend
- **Framework**: Next.js 15.1.0 (React 19)
- **Styling**: TailwindCSS
- **UI Components**: Radix UI
- **State Management**: React Query
- **Authentication**: NextAuth.js
- **Data Visualization**: Recharts
- **Type Safety**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer
- **Validation**: Express Validator

## Features
- User Authentication and Authorization
- Item Listing and Management
- Barter Request System
- Real-time Chat
- User Profiles
- Search and Filtering
- Rating System
- Admin Dashboard

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/Barter-Bay.git
cd Barter-Bay
```

2. Install dependencies
```bash
# Install frontend dependencies
cd arin
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

# Backend (.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3001
```

4. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd ../arin
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Project Structure

```
Barter-Bay/
├── arin/                 # Frontend application
│   ├── app/             # Next.js app directory
│   ├── components/      # Reusable components
│   ├── lib/            # Utility functions
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript type definitions
│
└── backend/            # Backend application
    ├── src/
    │   ├── controllers/ # Route controllers
    │   ├── models/     # Database models
    │   ├── routes/     # API routes
    │   └── middleware/ # Custom middleware
```

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. 