import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './hooks/useThemeContext';
import { useAuthContext } from './hooks/useAuthContext';

// components
import Create from './pages/create/Create';
import Home from './pages/home/Home';
import Recipe from './pages/recipe/Recipe';
import Search from './pages/search/Search';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Footer from './components/Footer';
import background from './assets/background.jpg';
import ThemeSelector from './components/ThemeSelector';
import Searchbar from './components/Searchbar';

// styles
import './App.css';
import Update from './pages/update/Update';

function App() {
  const [open, setOpen] = useState(false);
  const { authIsReady, user } = useAuthContext();
  const { mode } = useTheme();

  useEffect(() => {
    if(user) { setOpen(false) }
  }, [user]);

  return (
    <div 
      className="App"
      style={{ backgroundImage: `url(${background})` }}
    >
      {authIsReady && 
        <BrowserRouter>
          <Navbar open={open} setOpen={setOpen} />
          <ThemeSelector />
          <Login open={open} setOpen={setOpen} />

          <div className={`container ${mode}`}>
            <div className="mobile-search"><Searchbar /></div>
            <Routes>
              <Route 
                path="/" 
                element={ <Home /> } 
              />
              <Route 
                path="/create" 
                element={user ? <Create /> : <Navigate to="/" />} 
              />
              <Route 
                path="/search" 
                element={ <Search /> } 
              />
              <Route 
                path="/update/:id" 
                element={user ? <Update /> : <Navigate to="/" />} 
              />
              <Route 
                path="/recipies/:id" 
                element={ <Recipe /> } 
              />
            </Routes>
          </div>
        </BrowserRouter>
      }
      <Footer />
    </div>
  );
}

export default App;
