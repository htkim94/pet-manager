---
name: Separate Frontend Backend
overview: Reorganize the project by moving existing frontend code into a `frontend/` folder and creating an empty `backend/` folder structure.
todos:
  - id: create-folders
    content: Create frontend/ and backend/ folders
    status: completed
  - id: move-frontend
    content: Move all frontend files (src, public, index.html, configs, package.json) into frontend/
    status: completed
  - id: update-gitignore
    content: Update root .gitignore for both frontend and backend
    status: completed
---

# Separate Frontend and Backend Structure

## Current Structure

All frontend code is at the root level.

## Target Structure

```
pet-manager/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── eslint.config.js
├── backend/
│   └── (empty for now)
├── .gitignore
└── README.md
```

## Files to Move into `frontend/`

- `src/` folder
- `public/` folder
- `index.html`
- `package.json`
- `package-lock.json`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `vite.config.ts`
- `eslint.config.js`

## Files to Keep at Root

- `.gitignore` (update to cover both frontend and backend)
- `README.md`