import { useTheme } from "../hooks/useThemeContext";
import icon from '../assets/mode-toggle.svg';
// styles
import styles from './ThemeSelector.module.css';
import { useAuthContext } from "../hooks/useAuthContext";

export default function ThemeSelector() {
  const { color, mode, changeColor, changeMode } = useTheme();
  const { user } = useAuthContext();

  const themeColors = [
    'rgba(0, 0, 0, 0.6)', // black
    'rgba(100, 0, 0, 0.6)', // red
    'rgba(0, 100, 0, 0.6)', // green
    'rgba(0, 0, 100, 0.6)', // blue
  ];

  const toggleMode = () => {
    changeMode(mode === 'light' ? 'dark' : 'light');
  }

  return (
    <div
      className={`${styles['theme-container']} ${styles[mode]}`}
      style={{ background: color }}
    >
      <div className={styles["theme-selector"]}>
        {user && <p className={styles.user}>Hi {user.displayName}!</p>}
        <div className={styles["mode-toggle"]}>
          <img 
            src={icon}
            alt="mode toggle icon"
            onClick={toggleMode}
            style={{ filter: mode === 'dark' ? 'invert(90%)' : 'invert(10%)'}}
          />
        </div>
        <div className={styles["theme-buttons"]}>
          {themeColors.map(color => (
            <div 
            key={color} 
            onClick={() => changeColor(color)}
            style={{ background: color }}
            />
            ))}
        </div>
      </div>
    </div>
  )
}
