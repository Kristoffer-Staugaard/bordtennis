import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { database } from '../services/firebaseClient';

export function useMorningtrainUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const usersRef = ref(database, 'infoscreenUsers');

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() ?? {};
      setUsers(Object.values(data));
      setLoading(false)
    },
    (err) => {
        console.error('Failed to fetch users', err);
        setError(err);
        setLoading(false);
      }
);

    return () => unsubscribe();
  }, []);

  return { users, loading, error };
}