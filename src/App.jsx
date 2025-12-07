import './App.scss'
import LeaderboardView from './pages/LeaderboardView'
import ProfileView from './pages/ProfileView.jsx'
import CreateView from './pages/CreateView.jsx'
import NewMatchView from './pages/NewMatchView.jsx'
import TournamentCreateView from './pages/TournamentCreateView.jsx'
import TournamentView from './pages/TournamentView.jsx'
import TournamentMatchView from './pages/TournamentMatchView.jsx'
import { Routes, Route, Link } from 'react-router-dom'



function App() {

  return (
    <main>


      <Routes>
        <Route path="/" element={<LeaderboardView />} />
        <Route path="/profile/:id" element={<ProfileView />} />
        <Route path='/create' element={<CreateView />} />
        <Route path='/log-kamp' element={<NewMatchView />} />
        <Route path='/opret-turnering' element={<TournamentCreateView />} />
        <Route path='/tournament/:tournamentId' element={<TournamentView />} />
        <Route path='/tournament/:tournamentId/match/:matchId' element={<TournamentMatchView />} />

      </Routes>

      <nav className="app-nav">
        <Link to="/">Leaderboard</Link>
        <Link to="/profile">Profile</Link>
        <Link to='/create'>Opret</Link>
      </nav>
    </main>
  )
}

export default App
