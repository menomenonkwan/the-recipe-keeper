import { useTheme } from '../hooks/useThemeContext';
// styles
import styles from './Footer.module.css';

export default function Footer() {
  const { color } = useTheme();
  const today = new Date();
  const year = today.getFullYear();

  return (
    <footer
      className={styles.footer}
      style={{ background: color }}
    >
      <p>&copy; {year} Food Lovers & Co.</p>      
    </footer>
  )
}
