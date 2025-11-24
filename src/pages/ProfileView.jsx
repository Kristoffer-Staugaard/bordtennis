import React from "react";
import "./ProfileView.scss";
import PlayerInfo from "../components/profile-specific/PlayerInfo";
import PlayerStats from "../components/profile-specific/PlayerStats";
import MatchHistory from "../components/profile-specific/MatchHistory";

function ProfileView() {
  return (
    <>
      <div className="profile-view">
        <PlayerInfo />
        <div className="profile-view__background">
          <PlayerStats />
          <MatchHistory />
        </div>
      </div>
    </>
  );
}

export default ProfileView;
