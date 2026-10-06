# GCPL Complaint Analytics Portal

Login-protected complaint dashboard for the Market Quality team (Godrej Consumer Products).

* **Front end:** Next.js (React) - dashboard, user management, data upload. Godrej brand standard (black/white, Arial).
* **Back end:** Next.js API routes (serverless functions) - login, users, monthly data.
* **Database:** Postgres (Neon) - users and published monthly data.
* Front end and back end live in **one Vercel project**.

## How it works

| Who | Can do |
|---|---|
| Admin | Upload the monthly Excel (cleaned in the browser, previewed, then published), add/edit/disable/delete users, set passwords, see the dashboard |
| User | Sign in and see the dashboard. Nothing to upload; data published by the admin is shown automatically |

Data is stored once on the server (one row per month). Publishing a month replaces any earlier upload for that month.

## Deploy on Vercel (free Hobby tier)

1. **Put the code on GitHub.** Create a new private repository and push this folder to it.
2. **Import into Vercel.** vercel.com > Add New > Project > pick the repository. Framework is detected as Next.js. Do not change build settings.
3. **Create the database.** In the new project open the *Storage* tab > Create Database > *Neon* (Postgres) > Free plan. Choose the Mumbai (ap-south-1) region if offered, then *Connect* it to the project. Vercel adds `DATABASE_URL` for you.
4. **Add three environment variables** (Settings > Environment Variables, tick Production/Preview/Development):
   * `AUTH_SECRET` - a long random string (run `openssl rand -base64 32`, or use any 32+ random characters)
   * `ADMIN_EMAIL` - your login email
   * `ADMIN_PASSWORD` - a strong password for the first admin
5. **Deploy / Redeploy** (Deployments > ... > Redeploy) so the variables take effect.
6. **First sign-in.** Open the site URL and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. The tables are created automatically on this first visit and the admin account is created.
7. **Publish data.** Upload data > choose the monthly Excel > check the preview > Publish.
8. **Add people.** User management > enter their email and a password > Add user. Send them the site URL and their password.
9. *(Recommended)* After first sign-in use Users > Edit to change your own password, then delete `ADMIN_PASSWORD` from the Vercel variables. It is only read while the users table is empty.

## Run locally

```bash
npm install
cp .env.example .env.local      # fill in DATABASE_URL (a free Neon database works), AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run dev                     # http://localhost:3000
```

## Where things are

```
app/                    pages (login, dashboard, admin/users, admin/upload) and API routes
app/api/auth/*          login, logout, me
app/api/users/*         user management (admin only)
app/api/months/*        publish / read monthly data (publish = admin only)
lib/normalize.js        cleaning layer for the raw Excel (edit the alias maps here)
lib/engine.js           dashboard charts, filters, drill-down
lib/deck.js             PowerPoint export (Godrej deck rules)
lib/constants.js        financial years, columns; add a new FY here
public/                 GCPL logo + Godrej signature (cropped, transparent)
```

## Adding a new financial year
Add one line to `FYS` in `lib/constants.js` (for example `{ id: 2728, label: 'FY 27-28', range: 'Apr 2027 - Mar 2028' }`). Add a fourth shade to `FY_TINTS` in `lib/engine.js` and one to the trend colours in `lib/deck.js` if you want a distinct colour.

## Limits to know about (free tier)
* A single month must stay under ~4 MB after cleaning (a normal 4,000-row month is about 0.9 MB).
* Neon free tier: 0.5 GB storage, which is many years of monthly data.
* Passwords are set by the admin (users cannot change their own yet). Sessions last 12 hours.
