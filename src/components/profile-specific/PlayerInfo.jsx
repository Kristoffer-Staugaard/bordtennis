import React from 'react'
import './PlayerInfo.scss'

function PlayerInfo() {

  return (
    <>
      <div className='player-info'> 
        <div className='player-info__img-container'>
          <img className='player-info__img' src="" alt="" />
          <div className='player-info__rank-container'>
            <h4>4</h4>
          </div>
        </div>
        <div className='player-info__text'>
          <h3>Sebastian</h3>
          <h6>1750 point</h6>
        </div>
      </div>
    </>
  )
}

export default PlayerInfo