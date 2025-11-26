import React from 'react'
import './MatchHistory.scss'

function MatchHistory() {

  return (
      <div className='match-history'>
        <div className='match-history__player'>
          <img className='match-history__profile-img' src="" alt="" />
          <h5>Sebastian</h5>
        </div>
        <div className='match-history__score'>
          <h6>3:1</h6>
        </div>
        <div className='match-history__player'>
          <h5>Morten</h5>
          <img className='match-history__profile-img' src="" alt="" />
        </div>
      </div>
  )
}

export default MatchHistory