# Lightning-cards backend
The backend, consisting of an express-js server and the socket-io server.

# Prerequisites for development & production
nodejs: >=16.x

# Environment variables
PORT=4000 (can be set in a .env file in the root)

# Build project
development: npm install
production: npm ci

# Run the app
development: npm run dev
production: npm run start
