import React from "react";
import "./MainBtn.scss";
import { Link } from "react-router-dom";

function MainBtn({ to = "#", label = "Label" }) {
  return (
    <div className="mainbtn">
      <Link to={to}>
        <div className="mainbtn__container">
          <h2>{label}</h2>
        </div>
      </Link>
    </div>
  );
}

export default MainBtn;
