# Revert to pre–visual redesign

Snapshot taken before the spec-sheet visual redesign (June 2026).

## Quick revert (file copy)

From the project root:

```bash
cp design-backup/pre-visual-redesign/index.html index.html
cp design-backup/pre-visual-redesign/css/* css/
cp design-backup/pre-visual-redesign/js/* js/
cp design-backup/pre-visual-redesign/case-studies/* case-studies/
```

Then hard-refresh the browser.

## Git revert

Restore from the backup branch:

```bash
git checkout backup/pre-visual-redesign -- index.html css/ js/ case-studies/
```

Or reset the whole branch to the tagged checkpoint:

```bash
git checkout main
git reset --hard design-pre-visual-redesign
```

Or check out the backup branch directly:

```bash
git checkout backup/pre-visual-redesign
```
