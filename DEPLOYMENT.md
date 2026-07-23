# Church of Christ Huddersfield — Deployment Guide

> **Audience:** This guide is written for beginners. Every step is explained in detail.
> By the end you will have the church website running live on the internet with:
> - A custom domain name
> - HTTPS (padlock in the browser)
> - Cloudflare CDN (faster loading for visitors worldwide)
> - Automatic deployments when you push code to GitHub

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Local Development Setup](#2-local-development-setup)
3. [Setting Up the Database (Neon)](#3-setting-up-the-database-neon)
4. [Running Database Migrations](#4-running-database-migrations)
5. [Understanding Authentication (Better-Auth)](#5-understanding-authentication-better-auth)
6. [Running Tests](#6-running-tests)
7. [Docker Overview](#7-docker-overview)
8. [Setting Up Hostinger VPS](#8-setting-up-hostinger-vps)
9. [Deploying to the VPS Manually (First Time)](#9-deploying-to-the-vps-manually-first-time)
10. [Setting Up Nginx & SSL](#10-setting-up-nginx--ssl)
11. [Setting Up Cloudflare CDN](#11-setting-up-cloudflare-cdn)
12. [Setting Up GitHub Actions CI/CD](#12-setting-up-github-actions-cicd)
13. [Creating Your First Admin User](#13-creating-your-first-admin-user)
14. [Environment Variables Reference](#14-environment-variables-reference)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Project Overview

This is a **Next.js 15** application. Here is what each piece of technology does:

| Technology | What it does |
|---|---|
| **Next.js** | The web framework — handles routing, server-side rendering, and API routes |
| **TypeScript** | Adds type safety to JavaScript (catches bugs at compile time) |
| **Tailwind CSS** | Utility-first CSS framework — style elements with class names |
| **Drizzle ORM** | Manages database queries in a type-safe way |
| **PostgreSQL / Neon** | The database — stores sermons, events, users, etc. |
| **Better-Auth** | Handles user registration, login, and sessions |
| **Vitest** | Fast unit test runner |
| **Playwright** | End-to-end test framework — tests in a real browser |
| **Docker** | Packages the app into a container for consistent deployment |
| **Nginx** | Web server — handles HTTPS and proxies requests to the app |
| **Cloudflare** | CDN — caches content globally and provides DDoS protection |
| **GitHub Actions** | CI/CD — automatically tests and deploys on every code push |

---

## 2. Local Development Setup

### Prerequisites

Install these on your development machine:

- [Node.js 20+](https://nodejs.org/) — the JavaScript runtime
- [Git](https://git-scm.com/) — version control
- A code editor: [VS Code](https://code.visualstudio.com/) is recommended

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/coc-app.git
cd coc-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Then open .env.local in your editor and fill in the values
# (see Section 3 for the DATABASE_URL)

# 4. Push the database schema to Neon
npm run db:push

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the church website.

### Available Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server |
| `npm run lint` | Check for code quality issues |
| `npm run db:push` | Apply schema changes to the database (without migrations) |
| `npm run db:migrate` | Run migration files in order |
| `npm run db:generate` | Generate migration files from schema changes |
| `npm run db:studio` | Open Drizzle Studio (visual database browser) |
| `npm run test` | Run unit tests once |
| `npm run test:watch` | Run unit tests in watch mode (re-runs on file save) |
| `npm run test:e2e` | Run end-to-end tests in headless browsers |
| `npm run test:e2e:ui` | Open the Playwright test runner with a GUI |

---

## 3. Setting Up the Database (Neon)

Neon is a serverless PostgreSQL database. It has a generous free tier that is
perfect for a small church website.

### Create a Neon account and database

1. Go to [https://neon.tech](https://neon.tech) and sign up for a free account.
2. Click **"New Project"**.
3. Enter a project name: `coc-app`
4. Select a region close to your VPS (e.g., EU Central for Hostinger Europe).
5. Click **"Create project"**.

### Get your connection string

1. In the Neon dashboard, click **"Connection Details"**.
2. Make sure **"Connection pooling"** is **on** (Neon Serverless driver).
3. Copy the connection string. It will look like:
   ```
   ******ep-xxx-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Paste it as the value of `DATABASE_URL` in your `.env.local` file.

---

## 4. Running Database Migrations

After setting up Neon, you need to create the database tables.

### Development (push schema directly)

For development, the easiest way is to push the schema directly:

```bash
npm run db:push
```

This compares your `db/schema.ts` file with the current database and applies
any differences. It is **not recommended for production** because it can cause
data loss if you rename or remove a column.

### Production (generate and run migrations)

For production, use migrations so changes are applied safely and tracked:

```bash
# 1. Generate a migration file from your latest schema changes
npm run db:generate

# 2. Review the generated SQL in db/migrations/ before applying it

# 3. Apply the migration to your database
npm run db:migrate
```

### Viewing your database

Drizzle Studio gives you a visual interface to browse and edit your data:

```bash
npm run db:studio
# Open http://local.drizzle.studio in your browser
```

---

## 5. Understanding Authentication (Better-Auth)

Better-Auth handles everything authentication-related:

- **Sign up**: Users register with email + password
- **Sign in**: Users log in and get a session cookie
- **Session**: The server checks the cookie on every request
- **Sign out**: The session cookie is invalidated

### User roles

The `user` table has a `role` column:

- `"user"` — default for all new registrations (can view the website)
- `"admin"` — can access the `/admin` CMS dashboard

### Creating your first admin user

After signing up normally, you need to manually set your role to `"admin"` in
the database. See [Section 13](#13-creating-your-first-admin-user).

---

## 6. Running Tests

### Unit tests (Vitest)

Unit tests check individual functions and components in isolation.
They run entirely in Node.js — no browser needed — so they are very fast.

```bash
# Run all unit tests once
npm run test

# Run in watch mode (re-runs when you save a file)
npm run test:watch

# Generate a coverage report
npm run test:coverage
# Open coverage/index.html to see which lines are not tested
```

### End-to-end tests (Playwright)

E2E tests open a real browser (Chromium and Firefox) and click around the site.
They are slower but give the highest confidence that everything works together.

```bash
# First, install the browsers (only needed once)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Open the Playwright UI (visual test runner)
npm run test:e2e:ui
```

> **Note:** E2E tests require a running Next.js server. The Playwright config
> automatically starts one for you, but it needs a valid `DATABASE_URL`.

---

## 7. Docker Overview

Docker packages the application and all its dependencies into a portable
"container". This ensures the app behaves identically on your laptop, in
CI, and on the production server.

### Key files

| File | Purpose |
|---|---|
| `Dockerfile` | Instructions to build the Docker image |
| `.dockerignore` | Files to exclude from the image (like `.gitignore` for Docker) |
| `docker-compose.yml` | Local development with Docker |
| `docker-compose.prod.yml` | Production deployment config |

### Building and running locally with Docker

```bash
# Build the image
docker build -t coc-app .

# Run the container (pass your env vars)
docker run -p 3000:3000 --env-file .env.local coc-app
```

---

## 8. Setting Up Hostinger VPS

### Purchase a VPS

1. Go to [hostinger.com](https://www.hostinger.com) and choose a **VPS** plan.
   - The **KVM 1** plan (1 vCPU, 4 GB RAM) is plenty for a small church website.
2. Choose **Ubuntu 22.04 LTS** as the operating system.
3. Set a strong root password, or better — upload your SSH public key.

### Initial server setup

SSH into your new VPS:

```bash
ssh root@YOUR_VPS_IP
```

Now run these commands to secure and configure the server:

```bash
# 1. Update the system
apt update && apt upgrade -y

# 2. Install essential tools
apt install -y curl wget git ufw

# 3. Install Docker
curl -fsSL https://get.docker.com | sh

# 4. Enable and start Docker
systemctl enable docker
systemctl start docker

# 5. Install Docker Compose plugin
apt install -y docker-compose-plugin

# 6. Set up a basic firewall
#    Allow SSH, HTTP, and HTTPS; block everything else
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
# Type "y" when prompted

# 7. (Optional but recommended) Create a non-root user
adduser deploy
usermod -aG docker deploy
# Then follow the prompts to set a password
```

### Setting up SSH key authentication (recommended)

On your local machine:

```bash
# Generate an SSH key pair (if you don't have one)
ssh-keygen -t ed25519 -C "deploy@coc-app"

# Copy your public key to the VPS
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@YOUR_VPS_IP
```

Now you can log in without a password:

```bash
ssh root@YOUR_VPS_IP
```

---

## 9. Deploying to the VPS Manually (First Time)

The CI/CD pipeline handles subsequent deployments automatically. But the
**first deployment** needs to be done manually to set everything up.

### On your VPS:

```bash
# 1. Create the app directory
mkdir -p /opt/coc-app
cd /opt/coc-app

# 2. Create the production .env file
#    Fill in your real values from the .env.example
nano .env
```

Paste and fill in:

```bash
DATABASE_URL="******ep-xxx.eu-central-1.aws.neon.tech/coc_db?sslmode=require"
BETTER_AUTH_SECRET="your-very-long-random-secret-here"
BETTER_AUTH_URL="https://yourchurch.com"
NEXT_PUBLIC_APP_URL="https://yourchurch.com"
```

Save the file (Ctrl+X, Y, Enter in nano).

```bash
# 3. Copy the docker-compose.prod.yml to the VPS
#    (Do this from your local machine)
scp docker-compose.prod.yml root@YOUR_VPS_IP:/opt/coc-app/
```

```bash
# 4. Back on the VPS — log in to GitHub Container Registry
#    Use a GitHub Personal Access Token with read:packages scope
#    (Create one at: GitHub → Settings → Developer Settings → Personal Access Tokens)
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# 5. Pull and start the app
export GITHUB_REPOSITORY="your-github-username/coc-app"
docker compose -f docker-compose.prod.yml up -d
```

```bash
# 6. Check that it's running
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

You should see the app listening on port 3000 (only accessible from localhost).

---

## 10. Setting Up Nginx & SSL

Nginx sits in front of the Next.js app and handles HTTPS encryption.

### Install Nginx and Certbot

```bash
# Install Nginx
apt install -y nginx

# Install Certbot (Let's Encrypt SSL certificate tool)
apt install -y certbot python3-certbot-nginx
```

### Configure Nginx

```bash
# Copy our Nginx config file (from your local machine)
scp nginx/nginx.conf root@YOUR_VPS_IP:/etc/nginx/sites-available/coc-app

# Edit the config and replace "yourchurch.com" with your real domain
nano /etc/nginx/sites-available/coc-app

# Enable the site (create a symbolic link)
ln -s /etc/nginx/sites-available/coc-app /etc/nginx/sites-enabled/coc-app

# Remove the default Nginx site (optional but clean)
rm /etc/nginx/sites-enabled/default

# Test the config for errors
nginx -t

# Reload Nginx
systemctl reload nginx
```

### Point your domain to the VPS

Before getting an SSL certificate, your domain must point to your VPS IP address.

1. Log in to your domain registrar (or Cloudflare if you've already moved there).
2. Create an **A record**:
   - Name: `@` (for `yourchurch.com`) and `www` (for `www.yourchurch.com`)
   - Value: your VPS IP address
   - TTL: 300 (5 minutes — can lower for faster propagation)
3. Wait for DNS to propagate (usually 5–30 minutes).
4. Test: `ping yourchurch.com` — it should show your VPS IP.

### Get an SSL certificate

```bash
# Get a certificate from Let's Encrypt (free!)
certbot --nginx -d yourchurch.com -d www.yourchurch.com

# Follow the prompts:
# - Enter your email address (for renewal reminders)
# - Agree to the terms of service
# - Choose option 2: "Redirect" (redirect HTTP to HTTPS automatically)
```

Certbot will:
1. Verify you own the domain (by checking the `.well-known/acme-challenge/` path)
2. Issue a free SSL certificate
3. Update your Nginx config to use HTTPS
4. Set up automatic renewal (every 90 days)

Test renewal with: `certbot renew --dry-run`

### Verify SSL

Visit `https://yourchurch.com` in your browser. You should see the padlock icon.

---

## 11. Setting Up Cloudflare CDN

Cloudflare acts as a "shield" between your visitors and your server:
- It caches static files (CSS, JS, images) at global edge servers
- It provides DDoS protection and blocks malicious traffic
- It can hide your VPS's real IP address

### Steps

1. Go to [cloudflare.com](https://www.cloudflare.com) and sign up for a free account.
2. Click **"Add a site"** and enter your domain name.
3. Choose the **Free plan**.
4. Cloudflare will scan your existing DNS records. Make sure the **A records** for
   `yourchurch.com` and `www.yourchurch.com` are listed with the orange cloud icon
   (this means traffic goes through Cloudflare's network).
5. Cloudflare will tell you to change your **nameservers** at your domain registrar.
   - Log in to your domain registrar (e.g., Hostinger Domains, Namecheap, GoDaddy).
   - Find the Nameserver settings and replace them with the two Cloudflare nameservers
     shown on your screen.
   - This can take up to 24 hours to propagate worldwide.

### Cloudflare SSL settings

1. In the Cloudflare dashboard, go to **SSL/TLS → Overview**.
2. Set the encryption mode to **"Full (strict)"**.
   - This means Cloudflare uses HTTPS to talk to your VPS too.
   - This is the most secure option and requires a valid SSL certificate on your server.

### Caching settings (optional)

1. Go to **Caching → Configuration**.
2. Set **Browser Cache TTL** to 4 hours (or longer for production).
3. Create a **Page Rule** to cache static assets:
   - URL: `yourchurch.com/_next/static/*`
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month

---

## 12. Setting Up GitHub Actions CI/CD

The CI/CD pipeline automatically:
- Runs tests on every pull request
- Deploys to the VPS when a PR is merged to master

### Add GitHub Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions** →
**New repository secret**.

Add these secrets:

| Secret name | Value | How to get it |
|---|---|---|
| `VPS_HOST` | Your VPS IP address | From Hostinger control panel |
| `VPS_USER` | `root` (or your deploy user) | The username you SSH with |
| `VPS_SSH_KEY` | Your private SSH key | `cat ~/.ssh/id_ed25519` (whole content) |
| `VPS_APP_DIR` | `/opt/coc-app` | The directory you created on the VPS |
| `GHCR_TOKEN` | GitHub Personal Access Token | See below |

### Creating a GHCR_TOKEN

1. GitHub → Settings (your personal settings, not the repo) →
   **Developer Settings** → **Personal access tokens** → **Tokens (classic)**.
2. Click **"Generate new token (classic)"**.
3. Give it a name: `coc-app-vps-deploy`
4. Set expiry: **No expiration** (or 1 year and rotate it)
5. Select scopes: `read:packages`
6. Click **"Generate token"** and copy the token immediately (it's only shown once!).

### Add repository variables

Go to **Settings → Secrets and variables → Actions → Variables → New repository variable**.

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://yourchurch.com` |

### Trigger your first automated deployment

```bash
# On your local machine — make a small change and push to master
git add .
git commit -m "feat: initial deployment"
git push origin master
```

Go to your repository → **Actions** tab to watch the deployment pipeline run.

---

## 13. Creating Your First Admin User

After deploying, you need to create an admin account to access the CMS.

### Step 1: Sign up normally

1. Go to `https://yourchurch.com/sign-up`
2. Create an account with your email and password

### Step 2: Promote the user to admin in the database

Connect to your Neon database (from the Neon dashboard, click **"SQL Editor"**):

```sql
-- Find your user ID
SELECT id, email, role FROM "user";

-- Update your role to admin (replace the email with yours)
UPDATE "user"
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### Step 3: Sign back in

Sign out and sign back in. Now you can access the CMS at
`https://yourchurch.com/admin`.

---

## 14. Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string from Neon |
| `BETTER_AUTH_SECRET` | ✅ Yes | Secret key (min 32 chars) for signing sessions |
| `BETTER_AUTH_URL` | ✅ Yes | Public URL of the app (no trailing slash) |
| `NEXT_PUBLIC_APP_URL` | ✅ Yes | Same as above — accessible in the browser |

---

## 15. Troubleshooting

### The app shows a database error

- Check that `DATABASE_URL` is correctly set in `.env.local` (development) or
  `/opt/coc-app/.env` (production).
- Make sure you have run `npm run db:push` (or migrations) to create the tables.
- In Neon, check the **Monitoring** tab to see if connections are being made.

### I can't log in to the admin

- Make sure you ran the SQL query to set your user's role to `"admin"`.
- Check the `BETTER_AUTH_SECRET` is the same in every environment.
- Clear your browser cookies and try again.

### The CI/CD pipeline fails

1. Go to the **Actions** tab in your GitHub repository.
2. Click the failed workflow run.
3. Click the failed step to see the error message.

Common causes:
- **`VPS_SSH_KEY` not set**: Add it in GitHub Secrets.
- **Docker login fails**: Create a new `GHCR_TOKEN` with `read:packages` scope.
- **Build fails**: Check that all env vars needed at build time are set as GitHub Variables (not Secrets).

### HTTPS not working / certificate error

```bash
# On the VPS, check the SSL certificate status
certbot certificates

# Renew if expiring
certbot renew

# Check Nginx logs
tail -100 /var/log/nginx/error.log
```

### The container keeps restarting

```bash
# Check container logs on the VPS
docker compose -f /opt/coc-app/docker-compose.prod.yml logs --tail=100

# Common cause: DATABASE_URL is wrong or the DB is unreachable
```

---

## Security Checklist

Before going live, verify the following:

- [ ] `.env` is in `.gitignore` and NOT committed to Git
- [ ] `BETTER_AUTH_SECRET` is a random string (at least 32 characters)
- [ ] The VPS firewall only allows ports 22, 80, 443
- [ ] SSH password authentication is disabled (only key-based SSH)
- [ ] Nginx is configured to proxy to `127.0.0.1:3000` (not `0.0.0.0`)
- [ ] Cloudflare SSL is set to "Full (strict)"
- [ ] Let's Encrypt certificate auto-renewal is working (`certbot renew --dry-run`)
- [ ] The first admin user has been created and tested
- [ ] Database backups are enabled in Neon (automatic on paid plans; manual on free)

---

*Built with ❤️ for the Church of Christ Huddersfield.*
