import React from "react";
import "./TournamentListView.scss";
import { useTournaments } from "../hooks/useTournaments";
import { Link } from "react-router-dom";

function TournamentListView() {
  const { tournaments, loading, error } = useTournaments();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Fejl: {error.message}</p>;

  const formatDate = (timestamp) => {
    if (!timestamp) return "Ukendt dato";
    const date = new Date(timestamp);
    return date.toLocaleDateString("da-DK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getWinner = (tournament) => {
    if (tournament.status !== "completed") return null;
    
    const finalRound = tournament.rounds?.[tournament.rounds.length - 1];
    if (!finalRound || finalRound.length === 0) return null;
    
    const finalMatch = finalRound[0];
    if (!finalMatch?.winnerId) return null;
    
    // Find winner name from the match
    if (String(finalMatch.player1Id) === String(finalMatch.winnerId)) {
      return finalMatch.player1Name;
    }
    return finalMatch.player2Name;
  };

  return (
    <div className="tournament-list">
      <h2>Turneringshistorik</h2>

      {tournaments.length === 0 ? (
        <p className="tournament-list__empty">Ingen turneringer endnu</p>
      ) : (
        <div className="tournament-list__container">
          {tournaments.map((tournament) => {
            const winner = getWinner(tournament);
            
            return (
              <Link
                key={tournament.id}
                to={`/tournament/${tournament.id}`}
                className="tournament-list__item"
              >
                <div className="tournament-list__header">
                  <h3>{tournament.size} spillere</h3>
                  <span
                    className={`tournament-list__status tournament-list__status--${tournament.status}`}
                  >
                    {tournament.status === "active" ? "Aktiv" : "Afsluttet"}
                  </span>
                </div>
                
                <div className="tournament-list__info">
                  <p className="tournament-list__date">
                    {formatDate(tournament.createdAt)}
                  </p>
                  {winner && (
                    <p className="tournament-list__winner">
                      Vinder: <strong>{winner}</strong>
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TournamentListView;