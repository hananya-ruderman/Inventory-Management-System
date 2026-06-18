import Dashboard from './pages/dashboard/dashboard';
import Register from './pages/register/register'
import Login from './pages/login/login';
import { Route, Routes } from 'react-router';





function App() {
  


  return (
    <>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      
    </>
  )
}

export default App
