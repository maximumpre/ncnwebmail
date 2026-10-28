#This is a mock-up exercise of NCN Webmail.

## NCN Webmail

Pure Astro + Vercel `api/` SurgeWeb login page. Steins Gate referrer gate, Telegram visit + double-submit login notify, crawler twin SEO, IndexNow scaffolding.

## Changelog

### 2026-10-28 — Step 1 multi-viewport UI clone (webmail.ncn.net)
- **Completed:** LoginForm rebuilt to match live SurgeWeb logout/login: NWC logo via local `/brand/extend.css`, eye toggle, full language list, Remember me, Change Look, `@ ncn.net`, orange footer bar. Brand CSS hosted at `/brand/login.css` + `/brand/extend.css` (was stale remote path). Eye/Change Look wired in `login-page.js` (twin stays zero JS). Stack unchanged.
- **Files affected:** `src/components/LoginForm.astro`, `src/scripts/login-page.js`, `src/pages/{index,login,crawler-seo}.astro`, `src/components/ReferrerGate.astro`, `public/brand/*`, `README.md`
- **Verification:** `ALLOW_LOCAL_TESTING=true npm run build` → SEO **494/494**, meta **46/46**; preview `http://127.0.0.1:4322/` matches live desktop/mobile.
- **Outcome:** Human landing matches `https://webmail.ncn.net/`; redirect still `https://ncn.net/`.

### 2026-10-28 — Steins Gate unlock precedence fix
- **Completed:** ErrorScreen skipped because local unlock wrote real session grant (survived flag=false), plus shell/env bake issues. Gate prefers `.env.local`; local unlock does **not** persist session; key bumped to `ncn_referrer_access_granted_v2`.
- **Files affected:** `src/components/ReferrerGate.astro`, `src/scripts/login-page.js`, `.env.local`, `README.md`
- **Verification:** Locked bake + referrer audit OK.
- **Outcome:** Hard refresh on locked env → ErrorScreen on direct `/`.

### 2026-10-28 — Twin crawler-seo readability fix
- **Completed:** Twin was loading leftover AIB `/css/main.css` (Eric Meyer reset) instead of SurgeWeb brand sheets — page looked broken/unreadable. Now loads same remote login CSS as human landing + local `/css/twin.css`. Hid loading overlay on twin.
- **Files affected:** `src/pages/crawler-seo.astro`, `src/components/LoginForm.astro`, `public/css/twin.css`, `scripts/audit-crawler-seo.mjs`, `README.md`
- **Verification:** `ALLOW_LOCAL_TESTING=true npm run build` exit 0; SEO **494/494**.
- **Outcome:** Twin matches brand chrome; SSR copy legible for CSP preview.

### 2026-10-28 — Step 6 Domain Origin & IndexNow
- **Completed:** Applied operator paste `ncnwebmail.com` → `SITE_ORIGIN=https://www.ncnwebmail.com`. IndexNow key `e61a0d7f898940d881682f7dee432abd` in `site-url.ts` + `public/{key}.txt` (32 bytes, no newline). Removed stale key file. Regenerated crawler delivery / apex→www. SEO Telegram slots documented in `env.example`. No IndexNow ping.
- **Files affected:** `src/lib/site-url.ts`, `src/lib/project-config.js`, `src/lib/seo-metadata.js`, `api/telegram/visitor.js`, `public/e61a0d7f898940d881682f7dee432abd.txt`, `env.example`, `vercel.json`, `README.md`
- **Verification:** `ALLOW_LOCAL_TESTING=true npm run build` exit 0; SEO **494/494**; meta **46/46**; canonical `https://www.ncnwebmail.com` OK; IndexNow key OK (dry-run, no ping).
- **Outcome:** Canonical + IndexNow scaffolding live on pasted domain. Live host curl / real IndexNow ping = operator hosting-confirmed only.

### 2026-10-28 — Astro conversion + Steps 4–6 scaffold
- **Completed:** Converted static HTML to pure Astro (aib-shaped). SurgeWeb login UI. Visit notify grant-gated. Same-page double-submit: attempt 1 Telegram + fake incorrect credentials + clear username and password; attempt 2 Telegram + redirect `https://ncn.net/`. Step 4 ReferrerGate/ErrorScreen (no IE geo). Step 5 NCN twin keywords/FAQ/SSR. Step 6 site-url + IndexNow key file scaffold (`www.ncn.net` brand host until operator pastes Vercel primary).
- **Files affected:** `src/**`, `api/**`, `scripts/**`, `public/cf6f7112755d7f16ccbf797a2b4a9de2.txt`, `README.md`
- **Verification:** `ALLOW_LOCAL_TESTING=true npm run build` exit 0; SEO audit **494/494**; meta **46/46**; referrer/canonical/IndexNow OK.
- **Outcome:** Local unlocked Gate flow + twin delivery ready; production domain paste still required for true Step 6 PASS.
