# Automatic bKash SMS Transaction Tracking System

An internal Android app for automatically tracking bKash transaction SMS messages, storing them in a PostgreSQL database, and displaying them in a React Native mobile application.

## Project Structure

```
TrxApp/
├── backend/          # Node.js + Express + Prisma + PostgreSQL
│   ├── prisma/       # Database schema and migrations
│   └── src/          # Backend source code
├── frontend/         # React Native Expo Bare Workflow
│   ├── app/          # Expo Router app structure
│   └── src/          # Frontend utilities and services
└── README.md         # This file
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm (for backend) or npm
- Android Studio (for building the Android app)
- Expo CLI

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the `backend` directory (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your database URL and API token:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/trxapp?schema=public
API_TOKEN=your-secure-api-token-here
PORT=8000
```

5. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

6. Start the development server:
```bash
pnpm dev
```

The backend API will be available at `http://localhost:8000`

### Backend API Endpoints

- `POST /api/transactions` - Create a new transaction (requires authentication)
- `GET /api/transactions` - Get all transactions (requires authentication)
- `GET /api/transactions/:trxId` - Get transaction by ID (requires authentication)

All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer your-api-token-here
```

## Frontend Setup

### Important: SMS Listener Library

This app requires a native SMS listener module for Android. For Expo bare workflow, you'll need to:

1. **Install a native SMS listener library** (e.g., `react-native-android-sms-listener`)
2. **Configure the native module** in your Android project
3. **Update the SMS listener service** (`frontend/src/services/smsListener.ts`) with the actual implementation

**Note:** The current SMS listener implementation is a placeholder. You need to integrate a native module that can read SMS messages on Android.

### Frontend Setup Steps

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your backend API URL and token:
```env
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_API_TOKEN=your-secure-api-token-here
```

5. For Expo bare workflow, you'll need to prebuild the native projects:
```bash
npx expo prebuild
```

6. Start the development server:
```bash
npm start
```

7. Build and run on Android:
```bash
npm run android
```

## SMS Listener Implementation

The SMS listener service (`frontend/src/services/smsListener.ts`) requires a native module to actually listen for incoming SMS messages. Here's what you need to do:

1. **Install a native SMS library** (for example):
```bash
npm install react-native-android-sms-listener
```

2. **For Expo bare workflow**, you'll need to:
   - Add the native module configuration
   - Link the native module (if required)
   - Rebuild the Android app

3. **Update `smsListener.ts`** with the actual library implementation. Example:
```typescript
import SmsListener from 'react-native-android-sms-listener';

// In startListening():
this.listenerId = SmsListener.addListener((sms: SmsData) => {
  this.handleSms(sms);
});

// In stopListening():
SmsListener.removeListener(this.listenerId);
```

## Android Permissions

The app requires the following Android permissions (already configured in `app.json`):
- `READ_SMS` - To read incoming SMS messages
- `RECEIVE_SMS` - To receive SMS broadcasts

These permissions are automatically requested when the app starts.

## Database Schema

The `Transaction` table stores the following fields:
- `id` - Auto-increment primary key
- `trx_id` - Unique transaction ID (TrxID from SMS)
- `provider` - Payment provider (always "bKash")
- `amount` - Transaction amount
- `sender_number` - Sender mobile number
- `balance` - Available balance after transaction
- `transaction_date` - Transaction date (from SMS)
- `transaction_time` - Transaction time (from SMS)
- `raw_sms` - Full original SMS text
- `created_at` - Record creation timestamp

## SMS Format

The system processes SMS messages with the following format:
```
You have received Tk 380.00 from 01831638032.
Fee Tk 0.00.
Balance Tk 508.03.
TrxID DA72U4603O at 07/01/2026 19:06
```

## Features

- ✅ Automatic SMS detection and parsing
- ✅ Duplicate transaction prevention
- ✅ API authentication
- ✅ Transaction history display
- ✅ Real-time transaction sync (when SMS listener is implemented)
- ✅ Background processing support (requires native module implementation)

## Development Notes

1. **Backend**: Uses Prisma ORM for database operations. Run `npx prisma studio` to view the database in a GUI.

2. **Frontend**: Built with Expo Router for file-based routing. The main transaction list is at the "Transactions" tab.

3. **SMS Parsing**: The SMS parser (`src/utils/smsParser.ts`) extracts transaction data using regex patterns.

4. **API Client**: The API client (`src/services/apiClient.ts`) handles all backend communication with authentication.

## Security Considerations

- The API uses token-based authentication (Bearer token)
- Store API tokens securely (use environment variables)
- The backend should be accessible only from your phone (consider VPN or local network)
- Database access should be restricted

## Troubleshooting

### Backend Issues
- Make sure PostgreSQL is running
- Check that DATABASE_URL is correct
- Verify API_TOKEN is set in .env
- Run `npx prisma generate` if you see Prisma client errors

### Frontend Issues
- Make sure backend is running and accessible
- Check that API_URL and API_TOKEN are set in .env
- For SMS listener: Ensure native module is properly installed and linked
- Check Android permissions are granted in device settings

### SMS Listener Not Working
- Verify native SMS library is installed
- Check Android permissions are granted
- Ensure the native module is properly linked
- Rebuild the Android app after installing native modules

## Future Enhancements

- Support for Nagad and Rocket SMS formats
- Daily/monthly transaction summaries
- Auto-matching with e-commerce orders
- Export transactions as CSV/Excel
- Notification on successful sync
- Offline queue for failed API requests

## License

This is an internal project for personal use only.

