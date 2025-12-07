import { database } from "./firebaseClient";
import { ref, push, get, update } from "firebase/database";

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

export async function saveTournament(bracket) {
  const tournamentsRef = ref(database, 'tournaments')

  const tournamentData = {
    ...bracket,
    createdAt: Date.now(),
    status: 'active',
  };

  const result = await push(tournamentsRef, tournamentData);

  const tournamentId = result.key;

  return tournamentId;
}

export async function advanceWinner(tournamentId, matchId, winnerId) {

  // 1. Hent turnering fra Firebase
  const tournamentRef = ref(database, `tournaments/${tournamentId}`);
  const snapshot = await get(tournamentRef);

  if (!snapshot.exists()) {
    throw new Error(`Turneringen ${tournamentId} findes ikke`);
  }

  const tournament = snapshot.val()

  // 2. Find en specifik kamp og marker den som 'completed'
  let matchFound = false;
  let matchRoundIndex = -1;
  let matchIndexInRound = -1;

  for (let roundIndex = 0; roundIndex < tournament.rounds.length; roundIndex += 1) {
    const round = tournament.rounds[roundIndex] || [];

    for (let matchIndex = 0; matchIndex < round.length; matchIndex += 1) {
      if (round[matchIndex].id === matchId) {
        matchFound = true;
        matchRoundIndex = roundIndex;
        matchIndexInRound = matchIndex;

        tournament.rounds[roundIndex][matchIndex].winnerId = winnerId;
        break;
      }
    }

    if (matchFound) break;
  }

  if (!matchFound) {
    throw new Error(`Kampen ${matchId} findes ikke i turneringen `)
  }

    // 3. Ensure we have the correct number of rounds (Firebase might drop empty arrays)
    const expectedRounds = Math.log2(tournament.size);
    while (tournament.rounds.length < expectedRounds) {
      tournament.rounds.push([]);
    }
  
    // 4. Check if this is the final round BEFORE advancing
    const finalRoundIndex = expectedRounds - 1; // 0-indexed, so subtract 1
    
    // If we're in the final round, just mark it complete and return
    if (matchRoundIndex === finalRoundIndex) {
      // Check if all final round matches are complete
      const finalRound = tournament.rounds[matchRoundIndex];
      const allFinalMatchesComplete = finalRound.every(match => match.winnerId !== null);
      
      if (allFinalMatchesComplete) {
        tournament.status = 'completed';
      }
      
      await update(tournamentRef, tournament);
      return tournament;
    }
  
    // 5. If not final round, proceed with advancing winner
    const nextRoundIndex = matchRoundIndex + 1;
    const nextMatchIndex = Math.floor(matchIndexInRound / 2);
  
    // 6. Get vinder information
    const completedMatch = tournament.rounds[matchRoundIndex][matchIndexInRound];
  
    let winnerInfo;
    if (String(completedMatch.player1Id) === String(winnerId)) {
      winnerInfo = {
        id: completedMatch.player1Id,
        name: completedMatch.player1Name ?? null,
        avatar: completedMatch.player1Avatar ?? null,
      };
    } else {
      winnerInfo = {
        id: completedMatch.player2Id,
        name: completedMatch.player2Name ?? null,
        avatar: completedMatch.player2Avatar ?? null,
      };
    }
  
    // 7. Opret/updater næste runde
    const nextRound = tournament.rounds[nextRoundIndex] || [];
  
    if (nextRound.length === 0) {
      const matchesInNextRound = tournament.rounds[matchRoundIndex].length / 2;
      for (let i = 0; i < matchesInNextRound; i += 1) {
        nextRound.push({
          id: `m${nextRoundIndex + 1}-${i}`,
          player1Id: null,
          player1Name: null,
          player1Avatar: null,
          player2Id: null,
          player2Name: null,
          player2Avatar: null,
          winnerId: null,
        });
      }
    }
  
    const nextMatch = nextRound[nextMatchIndex];
  
    if (matchIndexInRound % 2 === 0) {
      nextMatch.player1Id = winnerInfo.id;
      nextMatch.player1Name = winnerInfo.name ?? null;
      nextMatch.player1Avatar = winnerInfo.avatar ?? null;
    } else {
      nextMatch.player2Id = winnerInfo.id;
      nextMatch.player2Name = winnerInfo.name ?? null;
      nextMatch.player2Avatar = winnerInfo.avatar ?? null;
    }
  
    tournament.rounds[nextRoundIndex] = nextRound;
    
    // 8. Push den opdaterede turnering tilbage til firebase
    await update(tournamentRef, tournament);
  
    return tournament;
}
