import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { useTheme } from '../hooks/useThemeContext';

// components 
import logo from '../assets/logo.png';
import Searchbar from './Searchbar';

// styles
import styles from './Navbar.module.css';

export default function Navbar({ open, setOpen }) {
  const { color, mode } = useTheme();
  const { user } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div className={`${styles.navbar} ${styles[`${mode}`]}`}
    style={{ background: color }}
    >
      <nav>
        <Link to="/" className={styles.brand}>
          <h1>The KitchenBuddy</h1>
        </Link>
        <img src={logo} alt="logo" className={styles.logo} />

        <Searchbar />

        {!user && <button className="btn" onClick={() => setOpen(!open)}>Login</button>}
        {user &&
          <>
            <Link to="/create" className="btn">Add Recipe</Link>
            {user && <button className="btn" style={{ marginLeft: '5px' }} onClick={logout}>Logout</button>}
          </>
        }
      </nav>
    </div>
  )
}
