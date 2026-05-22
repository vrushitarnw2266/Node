# My Vaggie — Vercel deploy checklist

Use this list when deploying **frontend + backend together** on one Vercel project.

---

## Before you deploy

- [ ] Code is pushed to **GitHub** (or GitLab / Bitbucket)
- [ ] **MongoDB Atlas** cluster created (free tier is fine)
- [ ] Atlas → **Database Access** → database user with password
- [ ] Atlas → **Network Access** → Add IP → **Allow access from anywhere** (`0.0.0.0/0`)
- [ ] Atlas → **Connect** → copy connection string → replace `<password>` with your password

Example `MONGO_URI`:
```
mongodb+srv://myuser:MyPass123@cluster0.xxxxx.mongodb.net/my_vaggie_?retryWrites=true&w=majority
```

- [ ] Generate `JWT_SECRET` (any long random string, 32+ characters)

---

## Vercel project setup

1. [ ] Open [vercel.com/new](https://vercel.com/new) → **Import** your repository
2. [ ] **Project name:** `my_vaggie_` (optional)
3. [ ] **Root Directory:** `.` (repo root — must contain `vercel.json`)
4. [ ] Do **not** override Build Command / Output Directory (use `vercel.json`)
5. [ ] Click **Deploy** (first deploy may fail API until env vars are set — that’s OK)

---

## Environment variables

**Vercel → Project → Settings → Environment Variables**

Add for **Production** (and Preview if you want):

| Variable | Example | Required |
|----------|---------|----------|
| `MONGO_URI` | `mongodb+srv://...` | Yes |
| `JWT_SECRET` | `a1b2c3...` (long random) | Yes |
| `CLIENT_URL` | `https://my-vaggie.vercel.app` | Yes |

**Do not add** `VITE_API_URL` on Vercel.

- [ ] All three variables saved
- [ ] **Redeploy** after adding env vars (Deployments → ⋯ → Redeploy)

---

## After deploy — test both parts

### Frontend (React)

- [ ] Open `https://YOUR-APP.vercel.app` — home page loads
- [ ] Preloader / navigation works
- [ ] Browse menu categories

### Backend (Express API)

- [ ] Open `https://YOUR-APP.vercel.app/api/`  
  Expected: `{ "message": "my_vaggie_ API running" }`

### Full flow

- [ ] **Register** a new account
- [ ] **Login** works (you stay logged in after refresh)
- [ ] Add item to **cart** → **place order**
- [ ] **Track orders** page shows your order
- [ ] **Book table** form submits (demo message)

If register/login fails → check `MONGO_URI`, Atlas network access, and Vercel **Functions** logs.

---

## How frontend + backend connect on Vercel

```
Browser  →  https://your-app.vercel.app/          →  React (static files)
Browser  →  https://your-app.vercel.app/api/...  →  Express (serverless)
                                              ↘  MongoDB Atlas
```

Same domain = no CORS issues. Cookies work with `secure` cookies in production.

---

## Common problems

| Problem | Fix |
|---------|-----|
| Site loads but API 500 / timeout | Set `MONGO_URI`, redeploy; check Atlas IP allow list |
| `API running` works but login fails | Set `JWT_SECRET`, redeploy |
| Menu empty | First API hit seeds DB; check Mongo connection in Function logs |
| Works locally, not on Vercel | Local uses `localhost` MongoDB; production needs Atlas |
| Slow first request | Normal (serverless cold start) — wait and retry |

**View logs:** Vercel → Project → **Deployments** → your deployment → **Functions** / **Runtime Logs**

---

## Local vs production

| | Local | Vercel |
|--|--------|--------|
| Frontend | `npm run dev` → :5173 | Built static files |
| Backend | `npm run dev:server` → :5000 | `/api` serverless |
| Database | `mongodb://127.0.0.1:27017/...` | `MONGO_URI` (Atlas) |
| API URL | `VITE_API_URL=http://localhost:5000` | Leave `VITE_API_URL` unset |

---

## Optional: deploy with Vercel CLI

```bash
npm i -g vercel
cd V:\Study\Node\sarikaMaM\FOOD_ORDER_WEB
vercel
vercel --prod
```

Set env vars in the dashboard or:

```bash
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add CLIENT_URL
```

---

**Done?** Share your live URL and test `/api/` + register once more.
