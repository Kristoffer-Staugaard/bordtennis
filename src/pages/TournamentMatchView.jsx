import React from "react";
import "./TournamentMatchView.scss";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { database } from "../services/firebaseClient";
import { ref, get } from "firebase/database";
import { recordMatch } from "../services/matchService";
import { advanceWinner } from "../services/tournamentService";

function TournamentMatchView() {
  const { tournamentId, matchId } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);

  const [setsPlayer1, setSetsPlayer1] = useState("");
  const [setsPlayer2, setSetsPlayer2] = useState("");

  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const tournamentRef = ref(database, `tournaments/${tournamentId}`);

      const snapshot = await get(tournamentRef);

      if (snapshot.exists()) {
        const t = snapshot.val();

        for (const round of t.rounds || []) {
          const found = round.find((m) => m.id === matchId);
          if (found) {
            setMatch(found);
            break;
          }
        }
      }
    };

    loadData();
  }, [tournamentId, matchId]);

  const determineWinnerId = () => {
    const sets1 = Number(setsPlayer1);
    const sets2 = Number(setsPlayer2);

    if (!match?.player1Id || !match?.player2Id) return null;
    if (Number.isNaN(sets1) || Number.isNaN(sets2)) return null;
    if (sets1 === sets2) return null;

    return sets1 > sets2 ? match.player1Id : match.player2Id;
  }

  const handleSubmit = async () => {
    const winnerId = determineWinnerId();
    if(!winnerId) {
        alert('Ugyldigt resultat');
        return;
    }

    try {
        setStatus('Arbejder...');

        await recordMatch(
            match.player1Id,
            match.player2Id,
            winnerId,
            Number(setsPlayer1),
            Number(setsPlayer2)
        );

        await advanceWinner(tournamentId, matchId, winnerId);

        navigate(`/tournament/${tournamentId}`);
    } catch (err) {
        console.error(err);
        setStatus('error');
        alert(`Fejl: ${err.message}`)
    }
  };

  if (!match) return <p>Loading...</p>;

  const canSubmit =
    setsPlayer1 &&
    setsPlayer2 &&
    Number(setsPlayer1) !== Number(setsPlayer2);

  return (
    <div className="tournament-match">
      <h2>Turneringskamp</h2>
      
      <div className="tournament-match__players">
        <div>
          {match.player1Avatar ? (
            <img src={match.player1Avatar} alt={match.player1Name} />
          ) : (
            <div className="tournament-match__avatar-placeholder" />
          )}
          <h3>{match.player1Name}</h3>
        </div>
        <div>vs</div>
        <div>
          {match.player2Avatar ? (
            <img src={match.player2Avatar} alt={match.player2Name} />
          ) : (
            <div className="tournament-match__avatar-placeholder" />
          )}
          <h3>{match.player2Name}</h3>
        </div>
      </div>

      <div className="tournament-match__score-input">
        <input
          type="number"
          min="0"
          placeholder={`Sæt til ${match.player1Name}`}
          value={setsPlayer1}
          onChange={(e) => setSetsPlayer1(e.target.value)}
        />
        <span>:</span>
        <input
          type="number"
          min="0"
          placeholder={`Sæt til ${match.player2Name}`}
          value={setsPlayer2}
          onChange={(e) => setSetsPlayer2(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || status === "Arbejder..."}
      >
        {status === "Arbejder..." ? "Logger..." : "Log kamp"}
      </button>
    </div>
  );
}

export default TournamentMatchView;
