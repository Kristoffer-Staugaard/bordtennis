import React from 'react';
import './PlayerInfo.scss';
import { useMorningtrainUsers } from '../../hooks/useMorningtrainUsers';
import { useParams } from 'react-router-dom';


function PlayerInfo() {
  const { id } = useParams();
  const { users, loading, error } = useMorningtrainUsers()


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

  return (
      <div className='player-info'> 
        <div className='player-info__img-container'>
          <img className='player-info__img' src={player.thumbnail} alt={player.name} />
          <div className='player-info__rank-container'>
            <h4>4</h4>
          </div>
        </div>
        <div className='player-info__text'>
          <h3>{player.name}</h3>
          <h6>{player.rating} point</h6>
        </div>
      </div>
  );
}

export default PlayerInfo