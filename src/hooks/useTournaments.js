import { useEffect, useState } from "react";
import { database } from "../services/firebaseClient";
import { ref, onValue } from "firebase/database";

export function useTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tournamentsRef = ref(database, "tournaments");

    const unsubscribe = onValue(
      tournamentsRef,
      (snapshot) => {
        const data = snapshot.val() ?? {};

        const tournamentsList = Object.entries(data).map(
          ([id, tournament]) => ({
            id,
            ...tournament
          })
        );

        tournamentsList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        setTournaments(tournamentsList);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to fetch tournaments", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { tournaments, loading, error };
}
