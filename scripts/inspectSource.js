import fetch from "node-fetch";
const API_URL =
  "https://morningevents.dk/wp-json/morningevents/v1/infoscreen-users";

async function main() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const payload = await response.json();
  console.log(`Fetched ${payload.data.length} users`);
  console.dir(payload.data[0], { depth: null });

  const mappedUsers = payload.data.map((user) => ({
    id: user.id,
    name: user.name,
    thumbnail: user.profilePicture?.thumbnail ?? null,
    avatar: user.profilePicture?.avatar_size ?? null
  }))

  console.log(JSON.stringify(mappedUsers, null, 2))
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


