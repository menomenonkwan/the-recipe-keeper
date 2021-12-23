import { useTheme } from '../hooks/useThemeContext';
// styles
import styles from './Footer.module.css';

export default function Footer() {
  const { color, mode } = useTheme();
  const today = new Date();
  const year = today.getFullYear();

  return (
    <footer
      className={`${styles.footer} ${styles[`${mode}`]}`}
      style={{ background: color }}
    >
      <p>&copy; {year} Food Lovers & Co.</p>      
    </footer>
  )
}
