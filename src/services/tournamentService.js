export function createBracket(players, size) {
  if (![8, 16, 32].includes(size)) {
    throw new Error(
      `${size} personers bracket mulig. Vælg mellem 8, 16 og 32 personers bracket.`
    );
  }

  if (!Array.isArray(players)) {
    throw new Error(`Spillere skal være et array`);
  }

  if (players.length < size) {
    throw new Error(
      `Ikke nok spillere. Der skal være ${size} spillere, der er kun valgt ${players.length} spillere.`
    );
  }

  const selectedPlayers = players.slice(0, size);

  const shuffled = [...selectedPlayers];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  const firstRound = [];
  for (let i = 0; i < shuffled.length; i += 2) {
    const player1 = shuffled[i];
    const player2 = shuffled[i + 1];

    firstRound.push({
      id: `m1-${i / 2}`,
      player1Id: player1.id,
      player1Name: player1.name,
      player1Avatar: player1.avatar ?? player1.thumbnail ?? null,
      player2Id: player2.id,
      player2Name: player2.name,
      player2Avatar: player2.avatar ?? player2.thumbnail ?? null,
      winnerId: null,
    });
  }

  const totalRounds = Math.log2(size);

  const rounds = [];
  rounds.push(firstRound)

  for (let r = 2; r <= totalRounds; r += 1) {
    rounds.push([])
  }

  return {
    size,
    rounds,
  };
}
