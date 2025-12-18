import React from "react";
import "./PlayerRankCard.scss";

function PlayerRankCard({ name, avatar, rating, rank }) {
  return (
    <div className="player-rank-card">
      <div className="player-rank-card__info">
        <div className="player-rank-card__position">
          <h4>{rank ?? "?"}</h4>
        </div>
        <div className="player-rank-card__avatar-container">
          <img src={avatar} alt={name} className="player-rank-card__avatar" />
        </div>
        <h5 className="player-rank-card__name">{name}</h5>
      </div>
      <div className="player-rank-card__points">
        <h6>{rating} point</h6>
      </div>
    </div>
  );
}

export default PlayerRankCard;
