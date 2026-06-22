# Brian Chun — Portfolio

Static portfolio site.

## Preview locally

```bash
cd /Users/brianchun/Projects/brian-chun-portfolio
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## Structure

- `index.html` — main portfolio page
- `css/site.css` — Spec Rail redesign styles
- `assets/brian.jpg` — hero photo
- `assets/Brian-Chun-Resume.pdf` — resume (modal + download)
- `case-studies/` — case study detail pages

## Revert to original design

**Option A — file backup (fastest):**

```bash
cp design-backup/original/index.html index.html
cp design-backup/original/css/shared.css css/shared.css
cp design-backup/original/css/case-study.css css/case-study.css
cp design-backup/original/case-studies/*.html case-studies/
rm css/site.css
```

See `design-backup/REVERT.md` for details.

**Option B — git:**

```bash
git checkout design-v1-original -- index.html css/ case-studies/
git clean -f css/site.css   # remove new stylesheet if present
```

Or check out the full snapshot branch:

```bash
git checkout backup/pre-spec-rail-redesign
```
