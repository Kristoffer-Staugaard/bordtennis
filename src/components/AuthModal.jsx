import React, { useState } from "react";
import "./AuthModal.scss";

function AuthModal({ onSubmit, error }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(password);
    setPassword("");
  };

  return (
    <div className="auth-modal">
      <div className="auth-modal__backdrop" />
      <div className="auth-modal__content">
        <h2 className="auth-modal__title">Adgang krævet</h2>
        <p className="auth-modal__text">
          Indtast kodeord for at logge ind og oprette kampe og turneringer.
        </p>
        <form className="auth-modal__form" onSubmit={handleSubmit}>
          <input
            type="password"
            className="auth-modal__input"
            placeholder="Kodeord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="auth-modal__error">{error}</p>}
          <button type="submit" className="auth-modal__button">
            Fortsæt
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
