import React from "react";
import "./LeaderboardView.scss";
import PlayerRankCard from "../components/PlayerRankCard";

function LeaderboardView() {
  return (
    <>
      <div className="leaderboard__background">
        <div className="leaderboard__label">
          <h4>Rank</h4>
          <h4>Spiller</h4>
          <h4>Elo</h4>
        </div>
        <PlayerRankCard />
      </div>
    </>
  );
}

export default LeaderboardView;
