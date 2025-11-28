import React from "react";
import "./NewMatchView.scss";
import "../components/MainBtn.jsx";
import MainBtn from "../components/MainBtn.jsx";
import { useState } from "react";
import { useMorningtrainUsers } from "../hooks/useMorningtrainUsers.js";

function NewMatchView() {
  const { users, loading, error } = useMorningtrainUsers();
  const [player1Id, setPlayer1Id] = useState("");
  const [player2Id, setPlayer2Id] = useState("");
  const [setsPlayer1, setSetsPlayer1] = useState("");
  const [setsPlayer2, setSetsPlayer2] = useState("");
  const [status, setStatus] = useState(null);

  if (loading) return <p>loading...</p>;
  if (error) return <p>failed to load</p>;

  const determineWinnerId = () => {
    const sets1 = Number(setsPlayer1);
    const sets2 = Number(setsPlayer2);

    if (!player1Id || !player2Id) return null;
    if (sets1 === sets2) return null;

    return sets1 > sets2 ? player1Id : player2Id;
  };

const winnerId = determineWinnerId();
const canSubmit =
  player1Id && player2Id && player1Id !== player2Id && winnerId !== null;

const handleSubmit = async () => {
  if (!canSubmit) return;

  const winnerId = determineWinnerId();

  try {
    setStatus('processing');
    await recordMatch(player1Id, player2Id, winnerId);
    setStatus('success');
  } catch (err) {
    console.error(err);
    setStatus('error');
  }
};

  return (
    <div className="new-match">
      <div className="new-match__container">
        <select
          className="new-match__dropdown"
          value={player1Id}
          onChange={(event) => setPlayer1Id(event.target.value)}
        >
          <option value="">Vælg spiller 1</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}></option>
          ))}
        </select>
        <select
          className="new-match__dropdown"
          value={player2Id}
          onChange={(event) => setPlayer2Id(event.target.value)}
        >
          <option value="">Vælg spiller 1</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}></option>
          ))}
        </select>
        <div className="new-match__input-container">
          <input
            className="new-match__input"
            type="number"
            min="0"
            placeholder="Sæt til spiller 1"
            value={setsPlayer1}
            onChange={(event) => setSetsPlayer1(event.target.value)}
          />
          <input
            className="new-match__input"
            type="number"
            min="0"
            placeholder="Sæt til spiller 2"
            value={setsPlayer2}
            onChange={(event) => setSetsPlayer2(event.target.value)}
          />
        </div>
        <div className="new-match__result-preview">
          <h2>Resultat</h2>
          <div className="new-match__result-container">
            <div className="new-match__result-player1">
              <div className="new-match__img-container">
                <img className="new-match__player1-img" src="" alt="" />
              </div>
              <h5>Sebastian</h5>
            </div>
            <div className="new-match__result">
              <h6>3</h6>
              <h6>:</h6>
              <h6>1</h6>
            </div>
            <div className="new-match__result-player2">
              <h5>Sebastian</h5>
              <div className="new-match__img-container">
                <img className="new-match__player2-img" src="" alt="" />
              </div>
            </div>
          </div>
        </div>
        <button
          className="new-match__submit"
          onClick={handleSubmit}
          disable={!canSubmit}
        >
          Log kamp
        </button>
      </div>
    </div>
  );
}

export default NewMatchView;
