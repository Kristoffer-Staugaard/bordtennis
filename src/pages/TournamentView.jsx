import React from "react";
import "./TournamentView.scss";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { database } from "../services/firebaseClient";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

function TournamentView() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tournamentId) return;

    const tournamentRef = ref(database, `tournaments/${tournamentId}`);

    const unsubscribe = onValue(
      tournamentRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setError("Turnering findes ikke");
          setLoading(false);
          return;
        }

        setTournament(snapshot.val());
        setLoading(false);
      },
      (err) => {
        console.error("Failed to fetch tournament", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tournamentId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Fejl: {error}</p>;
  if (!tournament) return <p>Ingen turnering fundet</p>;

  const handleMatchClick = (match) => {
    if (match.player1Id && match.player2Id && !match.winnerId) {
      navigate(`/tournament/${tournamentId}/match/${match.id}`);
    }
  };

  return (
    <div className="tournament-view">
      <h2>Turnering ({tournament.size} spillere)</h2>
      <p>Status: {tournament.status === "active" ? "Aktiv" : "Afsluttet"}</p>

      <div className="tournament-view__bracket">
        {tournament.rounds.map((round, roundIndex) => (
          <div key={roundIndex} className="tournament-view__round">
            <h3>Runde {roundIndex + 1}</h3>

            {round.map((match) => (
              <div
                key={match.id}
                className={`tournament-view__match ${
                  match.winnerId ? "tournament-view__match--completed" : ""
                } ${
                  match.player1Id && match.player2Id && !match.winnerId
                    ? "tournament-view__match--clickable"
                    : ""
                }`}
                onClick={() => handleMatchClick(match)}
              >
                <div className="tournament-view__player">
                  {match.player1Id ? (
                    <>
                      <img
                        src={match.player1Avatar}
                        alt={match.player1Name}
                        className="tournament-view__avatar"
                      />
                      <span>{match.player1Name}</span>
                      {match.winnerId === match.player1Id && <span>✓</span>}
                    </>
                  ) : (
                    <span className="tournament-view__placeholder">TBD</span>
                  )}
                </div>

                <div className="tournament-view__vs">vs</div>

                <div className="tournament-view__player">
                  {match.player2Id ? (
                    <>
                      <img
                        src={match.player2Avatar}
                        alt={match.player2Name}
                        className="tournament-view__avatar"
                      />
                      <span>{match.player2Name}</span>
                      {match.winnerId === match.player2Id && <span>✓</span>}
                    </>
                  ) : (
                    <span className="tournament-view__placeholder">TBD</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TournamentView;
