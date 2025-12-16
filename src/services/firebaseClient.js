import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "bordtennis-app.firebaseapp.com",
  databaseURL: "https://bordtennis-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bordtennis-app",
  storageBucket: "bordtennis-app.firebasestorage.app",
  messagingSenderId: "297229326660",
  appId: "1:297229326660:web:b41c858be3591a21c3df11"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { app, database, ref, auth };
