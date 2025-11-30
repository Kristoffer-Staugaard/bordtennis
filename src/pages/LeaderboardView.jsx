import React from "react";
import "./LeaderboardView.scss";
import PlayerRankCard from "../components/PlayerRankCard";
import { useMorningtrainUsers } from "../hooks/useMorningtrainUsers";
import { Link } from "react-router-dom";

function LeaderboardView() {
  const { users, loading, error } = useMorningtrainUsers();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Failed to load users</p>;

  const sortedUsers = [...users].sort((a, b) => {
    const ratingA = a.rating;
    const ratingB = b.rating;
    return ratingB - ratingA;
  });

  return (
    <div className="leaderboard__background">
      <div className="leaderboard__label">
        <h4>Rank</h4>
        <h4>Spiller</h4>
        <h4>Elo</h4>
      </div>
      {sortedUsers.map((user, index) => (
        <Link
          key={user.id}
          to={`/profile/${user.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <PlayerRankCard
            key={user.id}
            name={user.name}
            avatar={user.avatar}
            rating={user.rating}
            rank={index + 1}
          />
        </Link>
      ))}
    </div>
  );
}

export default LeaderboardView;
