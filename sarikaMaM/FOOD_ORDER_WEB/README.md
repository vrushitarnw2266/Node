# my_vaggie_ (My Vaggie)

Vegetarian food ordering app — React (Vite + Tailwind) + Express + MongoDB.

## Run locally

```bash
# Terminal 1 — API (needs MongoDB)
cd server
cp .env.example .env
# Edit .env: MONGO_URI, JWT_SECRET
npm install
npm run dev

# Terminal 2 — frontend
cd client
npm install
npm run dev
```

Or from repo root: `npm run dev` (client only) and `npm run dev:server`.

Open **http://localhost:5173** — API is proxied to `http://localhost:5000` in dev.

---

## Deploy on Vercel

**Step-by-step checklist:** see [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)  
**Env template:** see [.env.vercel.example](./.env.vercel.example)

Frontend (React) and backend (Express) deploy together on one Vercel project.

### 1. Push to GitHub

Push this folder to a GitHub repository.

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repo
3. **Project name:** `my_vaggie_` (or any name you like)
4. **Root directory:** leave as `.` (repository root)
5. Vercel reads `vercel.json` automatically — no extra build settings needed

### 3. Environment variables (Vercel → Project → Settings → Environment Variables)

| Name | Value | Notes |
|------|--------|--------|
| `MONGO_URI` | `mongodb+srv://...` | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string |
| `JWT_SECRET` | long random string | e.g. `openssl rand -hex 32` |
| `CLIENT_URL` | `https://your-app.vercel.app` | Your production URL (no trailing slash) |
| `VERCEL` | `1` | Optional; server detects Vercel automatically |

**Do not set** `VITE_API_URL` on Vercel — leave it empty so the app calls `/api` on the same domain.

### 4. Deploy

Click **Deploy**. After build:

- Site: `https://my-vaggie.vercel.app` (depends on project name)
- API: `https://your-app.vercel.app/api/...`

### 5. MongoDB Atlas

- Network Access → **Allow access from anywhere** (`0.0.0.0/0`) for serverless, or use Vercel’s IP if you restrict
- Use the Atlas connection string as `MONGO_URI`

---

## Project layout

```
my_vaggie_/
├── api/index.js      → Vercel serverless (Express)
├── client/           → React UI (static build)
├── server/           → Express + Mongoose
├── vercel.json
└── package.json
```
