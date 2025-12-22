# Copilot instructions for bordtennis

Summary
- Single-page React + Vite app that displays player leaderboards, records matches (ELO), and runs tournaments. Uses Firebase Realtime Database and Firebase Auth. A scheduled GitHub Action syncs external user data into Realtime DB.

Big picture / where to look
- Frontend: React + Vite (entry: `src/main.jsx`, root component `src/App.jsx`). Routes live in `src/pages/` and small UI components in `src/components/`.
- Data layer and business logic: `src/services/` contains Firebase client (`firebaseClient.js`) and domain logic:
  - `matchService.js` — ELO calculation and `recordMatch` which updates `infoscreenUsers` and writes to `matches` node.
  - `tournamentService.js` — bracket creation and advance logic; tournaments are stored under `tournaments`.
- Realtime hooks: `src/hooks/*` use Firebase Realtime `onValue`/`ref` directly (e.g. `useMorningtrainUsers` reads `infoscreenUsers`).
- Scripts: `scripts/syncPlayer.js` is a Node ESM script that uses the Firebase Admin SDK to sync users from an external API into `infoscreenUsers` (used by the GitHub Action).
- CI: `.github/workflows/sync-infoscreen.yml` runs `scripts/syncPlayer.js` on a schedule and relies on secrets.

Key patterns & explicit guidance
- Data shapes to expect (important when changing fields):
  - `infoscreenUsers`: { id, name, thumbnail, avatar, rating }
  - `matches`: records with player names, avatars, sets, winnerId, timestamp
  - `tournaments`: bracket structure created by `createBracket`
- Use service functions for domain changes — e.g., modify ELO in `src/services/matchService.js` (search for `calculateNewRating`, `applyMatchToPlayers`, `recordMatch`).
- Hooks are thin adapters for Realtime Database: prefer editing services/hooks rather than sprinkling DB logic inside components.
- When adding/removing fields from persisted shapes, update `scripts/syncPlayer.js` and hooks that read the node (backwards compatibility matters).
  - `infoscreenUsers`: user objects (id, name, thumbnail, avatar, rating)
  - `matches`: historical match records pushed by `matchService.recordMatch` (contains player names, avatars, sets, winnerId, timestamp)
  - `tournaments`: objects built by `tournamentService.createBracket` and updated with `advanceWinner`
- Real-time reads/writes
  - Hooks use `onValue(ref(database, 'path'), ...)` and expect plain JS objects or arrays created from `Object.values(...)`.
  - Writes use `update()`, `push()`, and `ref(database, 'path')` from `firebase/database`.
- ELO & match logic
  - `src/services/matchService.js` contains the canonical ELO calculation; prefer using these functions (e.g. `calculateNewRating`, `applyMatchToPlayers`, `recordMatch`) when changing or adding match behavior.
- Tournament progression
  - `src/services/tournamentService.js` contains deterministic functions for creating brackets and advancing winners — follow the existing shape when mutating rounds.
- Admin auth & env vars
  - Admin password used client-side: `VITE_ADMIN_PASSWORD` (read with `import.meta.env.VITE_ADMIN_PASSWORD`) in `useAdminAuth.js`.
  - Firebase client uses `VITE_FIREBASE_API_KEY` in `src/services/firebaseClient.js`.
- Server-side script notes
  - `scripts/syncPlayer.js` runs in Node (the workflow uses Node 20). It expects the Firebase admin credentials to be present as `firebaseAdminKey.json` (the workflow decodes this from `FIREBASE_ADMIN_KEY_BASE64` secret). The script uses `node-fetch` and `firebase-admin`.

Dev workflows and useful commands
- Local dev: `npm run dev` (Vite dev server)
- Build: `npm run build`
- Preview production build: `npm run preview`
- Lint: `npm run lint` (`eslint.config.js`); style: **double quotes**, **semicolons**, **2-space** indent, **no trailing commas**.
- Node & CI: GitHub workflow uses Node 20; server scripts (e.g. `scripts/syncPlayer.js`) are ESM.
- Env: add `VITE_FIREBASE_API_KEY` and `VITE_ADMIN_PASSWORD` to `.env.local` for local runs.
- CI job for user sync: `.github/workflows/sync-infoscreen.yml` requires `FIREBASE_ADMIN_KEY_BASE64` (base64 admin JSON) and `FIREBASE_DB_URL`.

Conventions & style decisions to follow
- File naming: React components in `src/components/` use PascalCase files (e.g. `PlayerRankCard.jsx`) paired with SCSS file of same name (e.g. `PlayerRankCard.scss`).
- Copy/strings: some messages and comments are in Danish — when editing existing strings, prefer to keep consistent language/context.
- Small UI state is kept in components/hooks; heavy logic belongs in `src/services` (follow separation).

Security & sensitive data warnings (do not expose)
- The repo uses Firebase Admin credentials in CI (decoded into `firebaseAdminKey.json` in workflow). Never add raw admin keys to commits; use GitHub secrets.
- Keep `VITE_ADMIN_PASSWORD` and `VITE_FIREBASE_API_KEY` in environment (eg `.env.local`) not committed.

Examples (copyable patterns)
- Record a match (use existing function):
```js
import { recordMatch } from "src/services/matchService";
await recordMatch(player1Id, player2Id, winnerId, setsPlayer1, setsPlayer2);
```
- Create and save a tournament:
```js
import { createBracket, saveTournament } from "src/services/tournamentService";
const bracket = createBracket(players, 8);
const id = await saveTournament(bracket);
```
- Hook pattern (realtime list):
```js
import { onValue, ref } from "firebase/database";
onValue(ref(db, "infoscreenUsers"), (snap) => {
  const users = Object.values(snap.val() || {});
});
```

What NOT to change without extra care
- ELO calculation and `recordMatch` behavior — these drive leaderboard state and are used by multiple UI pieces.
- Tournament round indexing and IDs — `advanceWinner` relies on exact `id` and array positions.
- CI workflow secrets handling — changing how secrets are passed may break sync job.

If something is ambiguous
- Ask: what DB path should be changed, or provide a sample snapshot of the DB node to update code safely.
- If adding features that modify persisted shapes (e.g. add a field to `infoscreenUsers`), update `scripts/syncPlayer.js` and any hooks that assume the previous shape.

Next steps / if you want me to continue
- I can expand this into a short `AGENT.md` that includes a mini-checklist for safe DB changes and sample DB snapshots for tests.

---
Please review the sections above and tell me which parts you'd like expanded or any project-specific behaviors I missed.