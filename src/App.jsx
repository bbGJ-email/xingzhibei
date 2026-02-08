import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Exam from './pages/Exam.jsx'
import Admin from './pages/Admin.jsx'
import Login from './pages/Login.jsx'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  )
}

export default App