# Vaishnav Yarakaraju · Portfolio

Personal technology portfolio built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion** and **Lucide** icons. Fully static: no database, no backend, no paid services.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

Requires Node.js 18.18 or newer (20+ recommended).

## Editing content (no code needed)

Open **/admin** on the live site (e.g. https://vaishnav-portfolio-three-zeta.vercel.app/admin) and click **Continue with GitHub**. The profile editor shows your portfolio as cards, like a LinkedIn profile:

- Click the pencil (or **Edit intro**) to change something, **Add …** to add a role, project, certification or school, and the arrows to reorder.
- Skills: type a skill and press Enter; click × to remove it.
- Photos, certificates and PDFs can be uploaded straight from the edit windows.
- Nothing is saved until you click **Publish**. Publishing saves everything to GitHub in one go, and Vercel updates the live site in about a minute. The editor tells you when the changes are live.

All content lives in `content/*.json`. Short lists such as skills and tools are stored as comma-separated text, e.g. `Python, Java, SQL`. Uploaded files go to `public/images/uploads/`. The editor's code is in `src/admin/` (repository name and branch are in `src/admin/config.ts`).

### One-time admin setup

1. GitHub → Settings → Developer settings → **OAuth Apps** → **New OAuth App**
   - Homepage URL: `https://vaishnav-portfolio-three-zeta.vercel.app`
   - Authorization callback URL: `https://vaishnav-portfolio-three-zeta.vercel.app/api/callback`
2. Copy the **Client ID** and generate a **Client secret**.
3. Vercel → Project → Settings → Environment Variables: add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`, then redeploy.

Only GitHub accounts with write access to the repository can save changes. If the site moves to a custom domain, update both URLs in the OAuth App and `site_url` in `public/admin/config.yml`.

## Deploy to Vercel (free)

1. Create a new GitHub repository and push this folder to it.
2. Go to <https://vercel.com/new>, sign in with GitHub and import the repository. Framework preset: **Next.js**; no settings needed.
3. Click **Deploy**. Every push to `main` redeploys automatically; pull requests get preview URLs.
4. Optional: in Project → Settings → Environment Variables add `NEXT_PUBLIC_SITE_URL=https://your-domain`.
5. Custom domain: Project → Settings → Domains → add the domain and follow the DNS instructions.

## Structure

```
src/
  app/            layout, home page, /projects/[slug], 404, icon, OG image, sitemap, robots
  components/     Nav, Hero, Summary, Experience, Projects, Diagram, Skills,
                  Certifications, Lightbox, Education, About, Contact, Footer
  content/        TypeScript loaders for /content/*.json
content/          all editable content (JSON, edited via /admin)
public/admin/     the admin panel (Decap CMS)
public/           resume PDF and images
```

## Features

- Floating nav with active-section highlight, smooth scrolling and a mobile menu
- Light and dark themes (follows the system, with a toggle)
- Expandable experience timeline, filterable project showcase and per-project detail pages
- Architecture diagrams generated from code (no stock imagery)
- Certificate lightbox, accessible keyboard focus states, skip link, reduced-motion support
- SEO metadata, Open Graph image, JSON-LD, sitemap, robots, favicon and a custom 404
