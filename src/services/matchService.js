import { database } from './firebaseClient'
import { ref, get, update } from 'firebase/database'

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
    const aWon = player1.id === winnerId
    const bWon = player2.id === winnerId

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

export async function recordMatch(player1Id, player2Id, winnerId) {
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

    return { updated1, updated2 };
}