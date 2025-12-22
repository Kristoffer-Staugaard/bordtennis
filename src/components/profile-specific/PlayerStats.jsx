import React, { useEffect, useState, useMemo } from "react";
import "./PlayerStats.scss";
import { useParams } from "react-router-dom";
import { database } from "../../services/firebaseClient";
import { ref, onValue } from "firebase/database";
import { useTournaments } from "../../hooks/useTournaments";

function PlayerStats() {
  const { id } = useParams();
  const playerId = String(id);

  const { tournaments } = useTournaments();

  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [winrate, setWinrate] = useState(null);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const matchesRef = ref(database, "matches");

    const unsubscribe = onValue(
      matchesRef,
      (snapshot) => {
        const data = snapshot.val() ?? {};
        const allMatches = Object.values(data);

        let winCount = 0;
        let lossCount = 0;

        for (const m of allMatches) {
          if (String(m.player1Id) === playerId || String(m.player2Id) === playerId) {
            if (String(m.winnerId) === playerId) {
              winCount += 1;
            } else if (m.winnerId !== null && m.winnerId !== undefined) {
              lossCount += 1;
            }
          }
        }

        const rate = winCount + lossCount === 0 ? null : Math.round((winCount / (winCount + lossCount)) * 100);

        setWins(winCount);
        setLosses(lossCount);
        setWinrate(rate);
        setMatchesLoading(false);
      },

      (err) => {
        console.error("Failed to fetch matches", err);
        setError(err);
        setMatchesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [playerId, id]);

  const tournamentWins = useMemo(() => {
    if (!Array.isArray(tournaments) || !id) return 0;

    let count = 0;

    for (const t of tournaments) {
      if (!t || t.status !== "completed") continue;

      const expectedRounds = Math.log2(t.size || 0);
      const finalRoundIndex = Math.max(0, Math.floor(expectedRounds) - 1);
      const finalRound = Array.isArray(t.rounds)
        ? t.rounds[finalRoundIndex] || []
        : [];

      // finalRound may contain one or more matches (but typically one)
      if (finalRound.some((m) => m && String(m.winnerId) === playerId)) {
        count += 1;
      }
    }

    return count;
  }, [tournaments, playerId, id]);

  return (
    <div className="player-stats">
      <div className="player-stats__container">
        <h2>{matchesLoading ? "—" : wins}</h2>
        <h6>Wins</h6>
      </div>

      <div className="player-stats__divider"></div>

      <div className="player-stats__container">
        <h2>{matchesLoading ? "—" : losses}</h2>
        <h6>Loses</h6>
      </div>

      <div className="player-stats__divider"></div>

      <div className="player-stats__container">
        <h2>{winrate === null ? "—" : `${winrate}%`}</h2>
        <h6>Winrate</h6>
      </div>

      <div className="player-stats__divider"></div>

      <div className="player-stats__container">
        <h2>{tournamentWins}</h2>
        <h6>Turneringsejre</h6>
      </div>

      {error && (
        <p className="player-stats__error">Kunne ikke loade statistik</p>
      )}
    </div>
  );
}

export default PlayerStats;
