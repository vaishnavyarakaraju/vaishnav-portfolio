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

## Editing content

All content lives in `src/content/`. You never need to touch the components to update the site.

| What | File |
| --- | --- |
| Name, headline, email, LinkedIn, **GitHub URL**, portrait, resume path | `src/content/site.ts` |
| Summary stats and focus areas | `src/content/summary.ts` |
| Jobs (newest first) | `src/content/experience.ts` |
| Projects (each gets its own page at `/projects/<slug>`) | `src/content/projects.ts` |
| Skill categories | `src/content/skills.ts` |
| Certifications | `src/content/certifications.ts` |
| Education | `src/content/education.ts` |
| About Me text and interests | `src/content/about.ts` |

### Things still to fill in

- **GitHub:** set `github` in `site.ts`. The GitHub buttons switch from "soon" to live links automatically.
- **Portrait:** add `public/images/portrait.jpg` and set `portrait: "/images/portrait.jpg"` in `site.ts`. It appears in the hero and About sections.
- **Certificate:** add the image to `public/certifications/` and set `image`, `issued`, `expires`, `credentialId` and `verifyUrl` in `certifications.ts`. Clicking the image opens a lightbox.
- **Project links and screenshots:** set `github` / `demo` and add images under `public/projects/<slug>/` listed in `screenshots`.
- **Resume:** replace `public/Vaishnav_Yarakaraju_Resume.pdf` (keep the filename, or update `resume` in `site.ts`).
- **Site URL:** set `NEXT_PUBLIC_SITE_URL` in Vercel (or edit `url` in `site.ts`) so social previews and the sitemap use the real domain.

Company or university logos should only be added from official assets (`logo` field, files in `public/`).

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
  content/        all editable content (see above)
public/           resume PDF and future images
```

## Features

- Floating nav with active-section highlight, smooth scrolling and a mobile menu
- Light and dark themes (follows the system, with a toggle)
- Expandable experience timeline, filterable project showcase and per-project detail pages
- Architecture diagrams generated from code (no stock imagery)
- Certificate lightbox, accessible keyboard focus states, skip link, reduced-motion support
- SEO metadata, Open Graph image, JSON-LD, sitemap, robots, favicon and a custom 404
