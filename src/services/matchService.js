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

export function applyMatchToPlayers(playerA, playerB, winnerId) {
    const aWon = playerA.id === winnerId
    const bWon = playerB.id === winnerId

    const { newRating: newRatingA, result: resultA } = calculateNewRating(
        playerA.rating,
        playerB.rating,
        aWon
    );

    const { newRating: newRatingB, result: resultB } = calculateNewRating(
        playerB.rating,
        playerB.rating,
        bWon
    );

    return {
        playerA: {
            ...playerA,
            rating: newRatingA,
            lastResult: resultA,
        },
        playerB: {
            ...playerB,
            rating: newRatingB,
            lastResult: resultB,
        },
    };
}

export async function recordMatch(playerAId, playerBId, winnerId) {
    // 1. Build references to both players in Firebase
    const playerARef = ref(database, `infoscreenUsers/${playerAId}`);
    const playerBRef = ref(database, `infoscreenUsers/${playerBId}`);

    // 2. Load both players in parallel
    const [snapA, snapB] = await Promise.all([
        get(playerARef),
        get(playerBRef),
    ]);

    if (!snapA.exists() || !snapB.exists()) {
        throw new Error('En eller begge spillere findes ikke');
    }

    const playerA = snapA.val();
    const playerB = snapB.val();

    // 3. Use your ELO logic to compute new ratings
    const { playerA: updatedA, playerB: updatedB } = applyMatchToPlayers(
        playerA,
        playerB,
        winnerId,
    )

    await Promise.all([
        update(playerARef, {rating: updatedA.rating}),
        update(playerBRef, { rating: updatedB.rating}),
    ]);

    return { updatedA, updatedB };
}