import { useEffect, useState } from "react";
import { auth } from "../services/firebaseClient";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

const ACCESS_KEY = "bt_admin_access";

export function useAdminAuth() {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(ACCESS_KEY) === "true";
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.error("Anonymous auth failed", err);
          setError("Kunne ikke logge ind anonymt");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const verifyPassword = (password) => {
    const expected = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!expected) {
      console.warn("VITE_ADMIN_PASSWORD er ikke sat i miljøvariablerne");
    }

    if (password && expected && password === expected) {
      localStorage.setItem(ACCESS_KEY, "true");
      setHasAccess(true);
      setError(null);
      return true;
    }

    setError("Forkert kodeord");
    return false;
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_KEY);
    setHasAccess(false);
  };

  return {
    loading,
    hasAccess,
    verifyPassword,
    error,
    logout
  };
}
