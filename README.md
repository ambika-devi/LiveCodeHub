# 🚀 LiveCodeHub  
A real-time collaborative code editor with live cursor sharing, chat, and multi-language code execution using Docker-based sandboxes.

## 📌 Features

### ✅ Real-Time Collaboration
- Multiple users can join the same room.
- Live text synchronization using **Socket.IO**.
- Real-time **cursor sharing** (each user sees others' cursors).
- Room-based isolation for documents.

### 🧪 Run Code in Multiple Languages
- Supports **JavaScript, Python, C, C++, Java, and more**.
- Executes code securely inside **isolated Docker containers**.
- Returns output, errors, and exit codes to the client.

### 💬 Built-in Room Chat
- Users inside a room can chat in real time.
- Messages stay room-scoped.

### 📁 Persistent Storage (MongoDB)
- Room documents are auto-saved.
- New users joining a room receive the latest synced version.

### 🎨 Clean UI (Next.js)
- Syntax-highlighted editor using **Monaco Editor**.
- Fast and responsive.
- Different themes for coding experience.

---

## 🛠️ Tech Stack

### **Frontend**
- Next.js 14+ (App Router or Pages Router)
- React
- Socket.IO Client
- Monaco Editor (VS Code Editor)

### **Backend**
- Node.js
- Express
- Socket.IO Server
- Mongoose + MongoDB

### **Code Runner**
- Docker-based isolated execution
- REST API for running code
- Auto-cleans containers after executing

---

## 📦 Project Structure

LiveCodeHub/
│── client/ # Frontend (Next.js)
│ ├── pages/
│ ├── components/
│ └── utils/
│
│── server/ # Backend API + Socket.IO
│ ├── models/
│ ├── socket/
│ └── index.js
│
│── runner/ # Code execution service (Docker)
│ ├── images/
│ └── server.js
│
│── README.md
│── package.json



---

## 🔧 Setting Up Locally

### **1. Clone the repository**
```bash
git clone git@github.com:your-username/LiveCodeHub.git
cd LiveCodeHub
2. Install dependencies
Client
cd client
npm install

Server
cd ../server
npm install

Runner
cd ../runner
npm install

⚙️ Environment Variables

Create server/.env:

MONGO_URI=mongodb+srv://your-db
PORT=4000
RUNNER_URL=http://localhost:5000


Create runner/.env:

PORT=5000


Create client/.env.local:

NEXT_PUBLIC_SERVER_URL=http://localhost:4000

▶️ Running the App
Start backend:
cd server
npm run dev

Start runner:
cd runner
npm run dev

Start frontend:
cd client
npm run dev


App runs at:

👉 http://localhost:3000

🐳 Docker Requirements

The runner uses Docker for executing code securely.

Ensure Docker is installed and running:

docker -v
docker ps
