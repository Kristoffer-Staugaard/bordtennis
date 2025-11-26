import './App.scss'
import LeaderboardView from './pages/LeaderboardView'
import ProfileView from './pages/ProfileView.jsx'
import { Routes, Route, Link } from 'react-router-dom'


function App() {

  return (
    <main>


      <Routes>
        <Route path="/" element={<LeaderboardView />} />
        <Route path="/profile/:id" element={<ProfileView />} />
      </Routes>

      <nav className="app-nav">
        <Link to="/">Leaderboard</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </main>
  )
}

export default App
