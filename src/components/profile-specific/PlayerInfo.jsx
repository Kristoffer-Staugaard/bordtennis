import React from 'react';
import './PlayerInfo.scss';
import { useMorningtrainUsers } from '../../hooks/useMorningtrainUsers';
import { useParams } from 'react-router-dom';
import { useFavoriteProfile } from '../../hooks/useFavoriteProfile';


function PlayerInfo() {
  const { id } = useParams();
  const { users, loading, error } = useMorningtrainUsers();
  const { setFavorite, isFavorite } = useFavoriteProfile();

  if (loading) return <p>Loading...</p>
  if (error) return <p>Failed to load users</p>

  const targetId = Number(id);

  if (!id || Number.isNaN(targetId)) {
    return <p>Invalid player Id</p>
  }

  const player = users.find((user) => user.id === targetId);

  if (!player) {
    return <p>Player not found</p>
  }

  const sortedUsers = [...users].sort((a, b) => {
    const ratingA = a.rating;
    const ratingB = b.rating;
    return ratingB - ratingA;
  });

  const playerRank = sortedUsers.findIndex((user) => user.id === targetId) + 1;

  const handleFavoriteToggle = () => {
    if (isFavorite(targetId)) {
      setFavorite(null);
    } else {
      setFavorite(targetId);
    }
  };

  return (
      <div className='player-info'> 
        <div className='player-info__img-container'>
          <img className='player-info__img' src={player.thumbnail} alt={player.name} />
          <div className='player-info__rank-container'>
            <h4>{playerRank}</h4>
          </div>
        </div>
        <div className='player-info__text'>
          <h3>{player.name}</h3>
          <h6>{player.rating} point</h6>
        </div>
        <button
          className={`player-info__favorite ${isFavorite(targetId) ? 'player-info__favorite--active' : ''}`}
          onClick={handleFavoriteToggle}
        >
          <svg
            className="player-info__favorite-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
  );
}

export default PlayerInfo