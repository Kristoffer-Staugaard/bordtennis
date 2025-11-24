import fetch from "node-fetch";
import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const adminKey = require('../firebaseAdminKey.json')

initializeApp({
  credential: cert(adminKey),
  databaseURL:
    "https://bordtennis-app-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = getDatabase();
const USER_PATH = "infoscreenUsers";

function mapUser(user) {
  return {
    id: user.id,
    name: user.name,
    thumbnail: user.profilePicture?.thumbnail ?? null,
    avatar: user.profilePicture?.avatar_size ?? null,
  };
}

async function main() {
  const response = await fetch ('https://morningevents.dk/wp-json/morningevents/v1/infoscreen-users')
  if (!response.ok) throw new Error(`API failed: ${response.status}`);
  const result = await response.json()

  const mapped = result.data.map(mapUser)

  const updates = {};
  for(const user of mapped) {
    updates[`${USER_PATH}/${user.id}`] = user;
  }

  const snapshot = await db.ref(USER_PATH).once('value');
  const existing = snapshot.val() ?? {};
  Object.keys(existing).forEach((id) => {
    if (!mapped.some((user) => String(user.id) === id)) {
      updates[`${USER_PATH}/${id}`] = null;
    }
  });

  await db.ref().update(updates);
  console.log(`Synced ${mapped.length} users`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
})
