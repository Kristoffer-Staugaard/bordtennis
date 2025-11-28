import './App.scss'
import LeaderboardView from './pages/LeaderboardView'
import ProfileView from './pages/ProfileView.jsx'
import CreateView from './pages/CreateView.jsx'
import NewMatchView from './pages/NewMatchView.jsx'
import { Routes, Route, Link } from 'react-router-dom'


function App() {

  return (
    <main>


      <Routes>
        <Route path="/" element={<LeaderboardView />} />
        <Route path="/profile/:id" element={<ProfileView />} />
        <Route path='/create' element={<CreateView />} />
        <Route path='/log-kamp' element={<NewMatchView />} />
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
