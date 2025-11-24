import React from 'react'
import './PlayerRankCard.scss'

function PlayerRankCard() {

  return (
    <>
      <div className='player-rank-card'>
        <div className='player-rank-card__info'>
          <div className='player-rank-card__position'>
            <h4>4</h4>
          </div>
          <img src="" alt="Profile image" className="player-rank-card__avatar" />
          <h5 className="player-rank-card__name">Sebastian</h5>
        </div>
        <div className='player-rank-card__points'>
          <h6>1750 point</h6>
        </div>
      </div>
    </>
  )
}

export default PlayerRankCard