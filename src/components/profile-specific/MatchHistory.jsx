import React from 'react'
import './MatchHistory.scss'
import { useParams } from 'react-router-dom';
import { database } from '../../services/firebaseClient';
import { ref, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';

function MatchHistory() {

  const { id } = useParams();
  const playerId = String(id);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const matchesRef = ref(database, 'matches');

    const unsubscribe = onValue(
      matchesRef,
      (snapshot) => {
        const data = snapshot.val() ?? {};
        const allMatches = Object.values(data);

        const playerMatches = allMatches.filter(
          (match) =>
            String(match.player1Id) === playerId ||
            String(match.player2Id) === playerId
        );

        playerMatches.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));

        setMatches(playerMatches);
        setLoading(false);
      },
      (err) => {
        console.error('Kunne ikke hente kamp', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  },  [playerId]);

  if (loading) return <p>Loader kampe...</p>;
  if (error) return <p>Kunne ikke loade.</p>;

  return (
    <>
      {matches.length === 0 && <p>Ingen kampe endnu.</p>}
  
      {matches.map((match, index) => (
        <div className="match-history" key={index}>
          <div className="match-history__player">
            <img
              className="match-history__profile-img"
              src={match.player1Avatar ?? ''}
              alt={match.player1Name}
            />
            <h5>{match.player1Name}</h5>
          </div>
  
          <div className="match-history__score">
            <h6>
              {match.setsPlayer1}:{match.setsPlayer2}
            </h6>
          </div>
  
          <div className="match-history__player">
            <h5>{match.player2Name}</h5>
            <img
              className="match-history__profile-img"
              src={match.player2Avatar ?? ''}
              alt={match.player2Name}
            />
          </div>
        </div>
      ))}
    </>
  );
}

export default MatchHistory