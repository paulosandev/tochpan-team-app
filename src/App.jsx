import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './modules/Dashboard'
import Inventory from './modules/Inventory'
import Sidebar from './components/Sidebar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Inventory></Inventory>
    </>
  )
}

export default App
