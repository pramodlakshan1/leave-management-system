# leave-management-system

## Setup
1. Clone the repo.
2. Backend (/server):
   - `npm install`
   - Create `.env` with MONGO_URI, PORT, JWT_SECRET.
   - Run `node seeder.js` to create default admin (email: admin@example.com, password: adminpassword).
   - `npm start`
3. Frontend (/client):
   - `npm install`
   - `npm start`

## Usage
- Login with admin credentials.
- For employees, create a user manually in DB or extend the app.
- APIs are protected with JWT.