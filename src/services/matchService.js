import { database } from './firebaseClient'
import { ref, get, update, push } from 'firebase/database'

export function calculateNewRating(playerRating, opponentRating, didWin) {
    let result = 0;

    const diff = playerRating - opponentRating;

    //Samme elo (inden for 50 point)
    if (Math.abs(diff) <= 50) {
        result = didWin ? 15 : -15;
    }

    //Opponent er højere elo
    else if (diff < -50) {
        result = didWin ? 25 : -10;
    }

    //Player er højere elo
    else if (diff > 50) {
        result = didWin ? 8 : -20;
    }

    const newRating = playerRating + result;

    return { newRating, result}
}

export function applyMatchToPlayers(player1, player2, winnerId) {
    const aWon = String(player1.id) === String(winnerId);
    const bWon = String(player2.id) === String(winnerId);

    const { newRating: newRating1, result: result1 } = calculateNewRating(
        player1.rating,
        player2.rating,
        aWon
    );

    const { newRating: newRating2, result: result2 } = calculateNewRating(
        player2.rating,
        player1.rating,
        bWon
    );

    return {
        player1: {
            ...player1,
            rating: newRating1,
            lastResult: result1,
        },
        player2: {
            ...player2,
            rating: newRating2,
            lastResult: result2,
        },
    };
}

export async function recordMatch(player1Id, player2Id, winnerId, setsPlayer1, setsPlayer2) {
    // 1. Build references to both players in Firebase
    const player1Ref = ref(database, `infoscreenUsers/${player1Id}`);
    const player2Ref = ref(database, `infoscreenUsers/${player2Id}`);

    // 2. Load both players in parallel
    const [snap1, snap2] = await Promise.all([
        get(player1Ref),
        get(player2Ref),
    ]);

    if (!snap1.exists() || !snap2.exists()) {
        throw new Error('En eller begge spillere findes ikke');
    }

    const player1 = snap1.val();
    const player2 = snap2.val();

    // 3. Use your ELO logic to compute new ratings
    const { player1: updated1, player2: updated2 } = applyMatchToPlayers(
        player1,
        player2,
        winnerId,
    )

    await Promise.all([
        update(player1Ref, {rating: updated1.rating}),
        update(player2Ref, { rating: updated2.rating}),
    ]);

    const matchesRef = ref(database, 'matches');

    const matchData = {
        player1Id,
        player1Name: player1.name,
        player1Avatar: player1.avatar ?? player1.thumbnail ?? null,

        player2Id,
        player2Name: player2.name,
        player2Avatar: player2.avatar ?? player2.thumbnail ?? null,

        setsPlayer1,
        setsPlayer2,
        winnerId,
        timestamp: Date.now(),
    }

    await push(matchesRef, matchData);

    return { updated1, updated2 };
}