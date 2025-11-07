import { BsCartFill } from "react-icons/bs";
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Auth } from './pages/Auth';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Product from './pages/Product';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">SLS Handicrafts</Link>
          <div>
            <Link to="/cart" className="btn btn-outline-light">
              <BsCartFill size={20}/>
            </Link>
          </div>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crafts/:craftId" element={<Product />}/>
          <Route path="/cart" element={<Cart />}/>
          <Route path='/cognito-signin' element={<Auth />}/>
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
