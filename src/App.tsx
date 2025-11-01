import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Product from './pages/Product'

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">SLS Handicrafts</Link>
          <div>
            <Link to="/cart" className="btn btn-outline-light">Your Cart</Link>
          </div>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crafts/:craftId" element={<Product />}/>
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
