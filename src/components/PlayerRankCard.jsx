import React from 'react'
import './PlayerRankCard.scss'

function PlayerRankCard({ name, avatar }) {

  return (
    <>
      <div className='player-rank-card'>
        <div className='player-rank-card__info'>
          <div className='player-rank-card__position'>
            <h4>4</h4>
          </div>
          <div className='player-rank-card__avatar-container'>
            <img src={avatar} alt={name} className="player-rank-card__avatar" />
          </div>
          <h5 className="player-rank-card__name">{name}</h5>
        </div>
        <div className='player-rank-card__points'>
          <h6>1750 point</h6>
        </div>
      </div>
    </>
  )
}

export default PlayerRankCard