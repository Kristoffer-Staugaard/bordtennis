import React from 'react'
import './PlayerStats.scss'

function PlayerStats() {

  return (
    <>
      <div className='player-stats'>
        <div className='player-stats__container'>
            <h2>2</h2>
            <h6>Turneringer</h6>
        </div>
        <div className='player-stats__divider'></div>
        <div className='player-stats__container'>
            <h2>7</h2>
            <h6>WIns</h6>
        </div>
        <div className='player-stats__divider'></div>
        <div className='player-stats__container'>
            <h2>5</h2>
            <h6>Loses</h6>
        </div>
        <div className='player-stats__divider'></div>
        <div className='player-stats__container'>
            <h2>60%</h2>
            <h6>Winrate</h6>
        </div>
      </div>
    </>
  )
}

export default PlayerStats