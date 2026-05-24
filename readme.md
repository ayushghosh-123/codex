# Real-Time Collaborative Code Editor

A robust, real-time collaborative coding environment built with React, Node.js, and WebSockets. This application allows multiple users to edit code simultaneously in a shared workspace, see each other's cursors, and maintain a history of their collaborative sessions.

## 🚀 Features

- **Real-Time Collaboration:** Powered by Yjs and WebSockets (Socket.io) for conflict-free, real-time code synchronization.
- **Advanced Code Editor:** Integrated Monaco Editor (the editor that powers VS Code) with syntax highlighting and intelligent code features.
- **Authentication:** Secure user authentication and session management using Clerk.
- **Room Management:** Create isolated collaborative rooms and invite team members.
- **History Tracking:** Persistent room history and user activity tracked via MongoDB and Mongoose.
- **Modern UI:** Responsive and modern user interface built with Vite, React, and Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19, Vite
- **Styling:** Tailwind CSS 4
- **Editor:** Monaco Editor (`@monaco-editor/react`)
- **Collaboration:** Yjs, `y-monaco`, `y-socket.io`
- **Authentication:** Clerk (`@clerk/clerk-react`)
- **HTTP Client:** Axios

### Backend
- **Runtime:** Bun
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose)
- **WebSockets:** Socket.io, `y-socket.io`

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (for frontend)
- [Bun](https://bun.sh/) (for backend)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a cloud instance)
- A [Clerk](https://clerk.com/) account for authentication keys.

## ⚙️ Environment Variables

Create `.env` files in both the `frontend` and `backend` directories.

**Backend (`backend/.env`):**
```env
MONGO_URI=mongodb://host.docker.internal:27017/learning # Use host.docker.internal when backend runs in Docker on Windows
PORT=3000
```

**Frontend (`frontend/.env`):**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Setup the Backend
```bash
cd backend
bun install
bun run dev
```
The backend server will start on `http://localhost:3000`.

### 3. Setup the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
The Vite development server will start, typically on `http://localhost:5173`.

## 📂 Project Structure

```text
.
├── backend/               # Node.js/Bun Express API & WebSocket Server
│   ├── config/            # Database and app configurations
│   ├── controllers/       # Route handlers
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── sockets/           # WebSocket event handlers
│   ├── index.ts           # Application entry point
│   └── package.json
│
└── frontend/              # React/Vite Client
    ├── public/            # Static assets
    ├── src/               # React components, contexts, and hooks
    ├── package.json
    └── vite.config.ts
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
