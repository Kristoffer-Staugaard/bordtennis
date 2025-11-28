import React from "react";
import "./CreateView.scss";
import MainBtn from "../components/MainBtn";

function CreateView() {
  return (
    <div>
      <div className="create__btn-container">
        <MainBtn to="/log-kamp" label="Log ny kamp" />
        <MainBtn to="/opret-turnering" label="Opret ny turnering" />
      </div>
    </div>
  );
}

export default CreateView;
