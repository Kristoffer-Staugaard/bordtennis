import { useState } from "react";

const FAVORITE_KEY = "favoriteProfileId";

export function useFavoriteProfile() {
  const [favoriteId, setFavoriteId] = useState(() => {
    const stored = localStorage.getItem(FAVORITE_KEY);
    return stored || null;
  });

  const setFavorite = (playerId) => {
    if (playerId) {
      localStorage.setItem(FAVORITE_KEY, String(playerId));
      setFavoriteId(String(playerId));
    } else {
      localStorage.removeItem(FAVORITE_KEY);
      setFavoriteId(null);
    }
  };

  const isFavorite = (playerId) => {
    return favoriteId === String(playerId);
  };

  return {
    favoriteId,
    setFavorite,
    isFavorite
  };
}
