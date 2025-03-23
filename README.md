# Todo App Backend

This is the backend of a Todo application built with Node.js, Express, TypeScript, and MongoDB. It provides RESTful APIs for user authentication (register/login) and task management (CRUD operations), secured with JWT.

## Prerequisites

- **Node.js**: Version 16.x or higher
- **pnpm**: Version 8.x or higher (install globally with `npm install -g pnpm`)
- **MongoDB**: Use the provided MongoDB database (details below) or set up your own instance (local or cloud, e.g., MongoDB Atlas).
- **Frontend Client**: The [Todo App Frontend](https://github.com/Jennie77777396/todo-vite) connects to this backend (see frontend README for setup).

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Jennie77777396/todo-backend-express-mongoDB.git
   cd todo-backend-express-mongoDB
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment**:
   - Create a `.env` file in the root directory based on the provided `.env.example`:
     ```bash
     MONGODB_URI=mongodb+srv://todo-user:Wjt123456@cluster0.wa9un.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     JWT_SECRET=8fK9pL2mN5qR7sT3vX6yZ0aB4cD8eG1hJ3kM6nP9qS2tV5wY8z
     ```
   - **Provided MongoDB Database**:
     - **URI**: `mongodb+srv://todo-user:Wjt123456@cluster0.wa9un.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
     - **Credentials**: Username: `todo-user`, Password: `Wjt123456`
     - **Database**: Connects to the `todo-app` database by default (or the default database in the cluster if unspecified).
     - Use this URI as-is for testing, or replace `MONGODB_URI` with your own MongoDB connection string if preferred.
   - **JWT_SECRET**: Use the provided key or generate a new secure key for production.

## Running the App

1. **Start the Server**:
   ```bash
   pnpm run build
   pnpm start
   ```
   - Uses `ts-node-dev` for hot-reloading. The server runs on `http://localhost:5000`.

2. **Verify**:
   - Logs should show:
     ```
     Server running on port 5000
     Connected to MongoDB
     ```

## API Endpoints

### Authentication
- **POST /auth/register**
  - Body: `{ "email": "user@example.com", "password": "123456" }`
  - Response: `{ "token": "jwt-token" }` (201 Created)
- **POST /auth/login**
  - Body: `{ "email": "user@example.com", "password": "123456" }`
  - Response: `{ "token": "jwt-token" }` (200 OK)

### Tasks (Requires Authorization Header: `Bearer <token>`)
- **GET /api/tasks**
  - Returns: Array of tasks for the authenticated user (200 OK)
- **POST /api/tasks**
  - Body: `{ "task": "Do something" }`
  - Returns: Created task object (201 Created)
- **PUT /api/tasks/:id**
  - Body: `{ "task": "Updated task", "completed": true }`
  - Returns: Updated task object (200 OK)
- **DELETE /api/tasks/:id**
  - Returns: No content (204 No Content)

## Project Structure

- `src/`
  - `models/`: Mongoose schemas (`userModel.ts`, `taskModel.ts`).
  - `routes/`: API routes (`authRoutes.ts`, `taskRoutes.ts`).
  - `middleware/`: Authentication middleware (`authMiddleware.ts`).
  - `index.ts`: Entry point with Express setup and MongoDB connection.

## Notes

- **Authentication**: Uses JWT. The token must be included in the `Authorization` header for `/api/*` routes.
- **Error Handling**: Returns JSON errors with status codes (e.g., 400, 401, 404, 500).
- **MongoDB**: Stores users in the `users` collection and tasks in the `tasks` collection within the provided database.

