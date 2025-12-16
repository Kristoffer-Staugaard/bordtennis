import React from "react";
import "./TournamentCreateView.scss";
import { useState } from "react";
import { useMorningtrainUsers } from "../hooks/useMorningtrainUsers";
import { createBracket, saveTournament } from "../services/tournamentService";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import AuthModal from "../components/AuthModal.jsx";

function TournamentCreationView() {
  const { loading: authLoading, hasAccess, verifyPassword, error: authError } =
    useAdminAuth();
  const { users, loading, error } = useMorningtrainUsers();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [bracketSize, setBracketSize] = useState(8);
  const [status, setStatus] = useState(null);

  const navigate = useNavigate();

  if (authLoading || loading) return <p>Loading...</p>;
  if (error) return <p>Failed to load users</p>;

  if (!hasAccess) {
    return (
      <AuthModal
        onSubmit={(password) => {
          verifyPassword(password);
        }}
        error={authError}
      />
    );
  }

  const handleCreate = async () => {
    if (selectedPlayerIds.length !== bracketSize) {
      alert(`Du skal vælge præcis ${bracketSize} spillere`);
      return;
    }

    try {
      setStatus("Opretter turnering");

      //Hent spiller objekter fra relevante ID's
      const selectedPlayers = users.filter((user) =>
        selectedPlayerIds.includes(String(user.id))
      );

      //Opret bracket
      const bracket = createBracket(selectedPlayers, bracketSize);

      //Gem til Firebase
      const tournamentId = await saveTournament(bracket);

      // Send brugeren til TournamentView
      navigate(`/tournament/${tournamentId}`);
    } catch (err) {
      console.error(err);
      setStatus("error");
      alert(`Fejl: ${err.message}`);
    }
  };
  return (
    <div className="tournament">
      <h2>Opret ny turnering</h2>
      <div className="tournament__size-selector">
        <label>Vælg bracket størrelse:</label>
        <select
          value={bracketSize}
          onChange={(e) => setBracketSize(Number(e.target.value))}
        >
          <option value={8}>8 spillere</option>
          <option value={16}>16 spillere</option>
          <option value={32}>32 spillere</option>
        </select>
      </div>
      <div className="tournament__player-list">
        <h3>
          Vælg spillere ({selectedPlayerIds.length} / {bracketSize}):
        </h3>
        {users.map((user) => {
          const isSelected = selectedPlayerIds.includes(String(user.id));
          const isDisabled =
            !isSelected && selectedPlayerIds.length >= bracketSize;

          return (
            <label
              key={user.id}
              className={`tournament__player-item ${
                isDisabled ? "tournament__player-item--disabled" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedPlayerIds([
                      ...selectedPlayerIds,
                      String(user.id),
                    ]);
                  } else {
                    setSelectedPlayerIds(
                      selectedPlayerIds.filter((id) => id !== String(user.id))
                    );
                  }
                }}
              />
              <span>{user.name}</span>
            </label>
          );
        })}
      </div>
      <button
        className="tournament__submit"
        onClick={handleCreate}
        disabled={
          selectedPlayerIds.length !== bracketSize ||
          status === "Opretter turnering"
        }
      >
        {status === "Opretter turnering" ? "Opretter..." : "Opret turnering"}{" "}
      </button>
    </div>
  );
}

export default TournamentCreationView;
