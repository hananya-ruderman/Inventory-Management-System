import './App.css'
import Login from './pages/login/login'
import Dashboard from './pages/dashboard/dashboard'
import { Route, Routes } from 'react-router';



function App() {
  
  

  return (
    <>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      
    </>
  )
}

export default App
