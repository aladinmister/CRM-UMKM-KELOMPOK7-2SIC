import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Routes,Route} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import MainLayout from './components/MainLayout'
import './App.css'
import SalesManagement from './components/Pages/SalesManagement'

function App() {
  const [count, setCount] = useState(0)

  return (
   <Routes>
    <Route element={<MainLayout/>} >
    <Route path='/' element={<Dashboard />} />
    <Route path= "/penjualan" element = {<SalesManagement/>} />
    </Route>
   </Routes>
  )
}

export default App
