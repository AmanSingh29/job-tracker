# 🚀 Scalable Job Importer with Queue Processing & History Tracking

## 🔗 Live Deployments

- **Frontend (Vercel):** https://job-tracker-mauve.vercel.app/
- **Backend (Render – Docker):** https://job-tracker-lkci.onrender.com

---

## 📌 Objective

This project implements a **scalable job import system** that fetches jobs from an external API (XML feeds), processes them asynchronously using **Redis queues**, stores them in **MongoDB**, and tracks detailed **import history** with **Next.js admin UI**.

---

## 🏗️ Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- BullMQ (Queue)
- Redis

---

## ⚙️ Backend Setup

### ✅ System Requirements

- Node.js (>=18)
- npm
- MongoDB (Local or Atlas)
- Redis (Local or Cloud)
- Docker (Optional)

---

### 📦 Install Dependencies

```bash
cd server
npm install
```

---

### 🔐 Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5050

# Your databse connection uri (cloud or local)
MONGODB_URI="mongodb://localhost:27017/job-tracker"
NODE_ENV="dev" or "production"

# your redis cloud credentials:
REDIS_HOST="your-redis-host"
REDIS_PORT="your-redis-port" or 6379
REDIS_PASSWORD="your-redis-password"

WORKER_CONCURRENCY=10
JOB_IMPORT_CRON_TIME="0 * * * *"
JOB_BATCH_SIZE=10000
```

---

### ▶️ Run Backend Server (Without Docker)

```bash
npm run start
```

You should see logs for:

- MongoDB connection
- Redis connection
- Worker started with concurrency

Server runs at:

```
http://localhost:5050
```

---

### 🐳 Run Backend (With Docker)

> ⚠️ Use Docker when docker is running on your system and we have **MongoDB Atlas / Cloud URI**

```bash
docker compose up -d
```

Check logs:

```bash
docker compose logs -f app
```

---

## 🌐 Backend APIs

### Get Import History

```
GET /importLog/
```

Example:

```
http://localhost:5050/importLog/
```

---

### Trigger Import Manually

```
POST /importJobs/
```

Example:

```
http://localhost:5050/importJobs/
```

---

## 🎨 Frontend Setup

### 📦 Install Dependencies

```bash
cd client
npm install
```

---

### 🔐 Environment Variables

Create `.env` inside `client` folder:

```env
NEXT_PUBLIC_SERVER_ENDPOINT="http://localhost:5050"
```

---

### ▶️ Build & Start

```bash
npm run build
npm run start
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🧪 Testing the System

### Cron-Based Import

- Default cron runs **every hour**
- Change to every minute for testing:

```env
JOB_IMPORT_CRON_TIME="* * * * *"
```

Restart backend after change.

---

### Manual Import

Use Postman:

```
POST http://localhost:5050/importJobs/
```

---

## 📊 Import History Tracking

Displayed in UI with:

- Pagination
- Sorting
- Filters (date, status)

---

## ✅ Assumptions

- Job uniqueness determined by job ID
- Redis persistence handled by provider
- Read-heavy admin dashboard


---

### 👨‍💻 Author

**Aman Singh**
