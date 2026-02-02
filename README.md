# TimeBanking Platform

A full-stack time-banking application where users exchange services using time as currency.  
**1 hour of service = 1 time credit**

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Tailwind CSS, lucide-react |
| Backend | Node.js, Express.js |
| Database | SQLite |
| Auth | JWT (Access + Refresh tokens) |

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```
Server runs on `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm start
```
App runs on `http://localhost:3000`

## Environment Variables

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_PATH=./database/timebank.db
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
INITIAL_TIME_CREDITS=5.0
MIN_TIME_BALANCE=-10.0
MAX_FILE_SIZE=5242880
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/avatar` | Upload avatar |
| POST | `/api/users/skills` | Add skill |
| DELETE | `/api/users/skills/:id` | Remove skill |
| GET | `/api/users/:id/reviews` | Get user reviews |
| GET | `/api/users/:id/services` | Get user services |
| GET | `/api/users/me/transactions` | Get transaction history |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List services (with filters) |
| GET | `/api/services/:id` | Get service details |
| POST | `/api/services` | Create service |
| PUT | `/api/services/:id` | Update service |
| DELETE | `/api/services/:id` | Delete service |
| GET | `/api/services/categories` | Get categories |
| GET | `/api/services/cities` | Get cities |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get my bookings |
| GET | `/api/bookings/:id` | Get booking details |
| POST | `/api/bookings` | Create booking |
| PUT | `/api/bookings/:id/accept` | Accept booking |
| PUT | `/api/bookings/:id/decline` | Decline booking |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |
| PUT | `/api/bookings/:id/complete` | Confirm completion |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages` | Get conversations |
| GET | `/api/messages/:userId` | Get conversation |
| POST | `/api/messages` | Send message |
| GET | `/api/messages/unread` | Get unread count |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/user/:userId` | Get user reviews |
| POST | `/api/reviews` | Create review |
| GET | `/api/reviews/can-review/:bookingId` | Check can review |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| GET | `/api/notifications/unread-count` | Get unread count |
| PUT | `/api/notifications/mark-all-read` | Mark all read |
| PUT | `/api/notifications/:id/read` | Mark as read |
| DELETE | `/api/notifications/:id` | Delete notification |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard stats |
| GET | `/api/dashboard/recommendations` | Get recommendations |

## Features

- **User Profiles**: Avatar upload, skills, bio
- **Service Catalog**: Filter by category, city, location type
- **Booking System**: Request → Accept → Complete workflow
- **Time Bank**: Atomic transfers, transaction history
- **Messaging**: Internal messenger with booking context
- **Reviews**: 1-5 star ratings, automatic user rating update
- **Notifications**: Real-time polling, unread badges
- **Dashboard**: Stats, recommendations, transaction history

## Design System

| Color | Hex | Usage |
|-------|-----|-------|
| Terracotta | `#E07856` | Primary actions, branding |
| Olive | `#8B9D77` | Secondary elements |
| Cream | `#F5E6D3` | Backgrounds |
| Amber | `#D4A574` | Accents |
| Deep Green | `#2F5233` | Text, emphasis |

## Testing

```bash
cd backend
node test-full-flow.js      # End-to-end user flow
node test-flow-2.js         # Search-to-review flow
node test-edge-cases.js     # Boundary conditions
node test-validation.js     # Input validation
node test-security.js       # Security audit
node test-performance.js    # Performance benchmarks
```

## License

MIT
