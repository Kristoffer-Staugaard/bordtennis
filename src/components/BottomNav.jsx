import React from "react";
import "./BottomNav.scss";
import { Link, useLocation } from "react-router-dom";
import { useFavoriteProfile } from "../hooks/useFavoriteProfile";
import leaderboardIcon from "../assets/leaderboard.svg";
import profileIcon from "../assets/profile.svg";
import opretIcon from "../assets/opret.svg";
import turneringIcon from "../assets/turnering.svg";

function BottomNav() {
  const location = useLocation();
  const { favoriteId } = useFavoriteProfile();

  const isActive = (path) => {
    if (path === "/profile" && favoriteId) {
      return location.pathname === `/profile/${favoriteId}`;
    }
    return location.pathname === path;
  };

  return (
    <nav className="bottom-nav">
      <Link
        to="/"
        className={`bottom-nav__item ${
          isActive("/") ? "bottom-nav__item--active" : ""
        }`}
      >
        <img
          src={leaderboardIcon}
          alt="Rangliste"
          className="bottom-nav__icon"
        />
        <h6>Rangliste</h6>
      </Link>

      {favoriteId ? (
        <Link
          to={`/profile/${favoriteId}`}
          className={`bottom-nav__item ${
            isActive("/profile") ? "bottom-nav__item--active" : ""
          }`}
        >
          <img src={profileIcon} alt="Profil" className="bottom-nav__icon" />
          <h6>Profil</h6>
        </Link>
      ) : (
        <div
          className="bottom-nav__item bottom-nav__item--disabled"
          title="Vælg en favorit profil først"
        >
          <img src={profileIcon} alt="Profil" className="bottom-nav__icon" />
          <h6>Profil</h6>
        </div>
      )}

      <Link
        to="/create"
        className={`bottom-nav__item ${
          isActive("/create") ? "bottom-nav__item--active" : ""
        }`}
      >
        <img src={opretIcon} alt="Opret" className="bottom-nav__icon" />
        <h6>Opret</h6>
      </Link>

      <Link
        to="/turneringer"
        className={`bottom-nav__item ${
          isActive("/turneringer") ? "bottom-nav__item--active" : ""
        }`}
      >
        <img
          src={turneringIcon}
          alt="Turneringer"
          className="bottom-nav__icon"
        />
        <h6>Turneringer</h6>
      </Link>
    </nav>
  );
}

export default BottomNav;
