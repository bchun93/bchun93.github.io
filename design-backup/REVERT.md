# Revert to original design

The pre–Spec Rail design is preserved in `design-backup/original/`.

## Quick revert

From the project root:

```bash
cp design-backup/original/index.html index.html
cp -r design-backup/original/css/* css/
cp -r design-backup/original/case-studies/* case-studies/
```

Then hard-refresh the browser.

## Git revert (after initial commit)

If you committed before the redesign:

```bash
git checkout design-v1-original -- index.html css/ case-studies/
```

Or restore the whole tree from the backup branch:

```bash
git checkout backup/pre-spec-rail-redesign
```
