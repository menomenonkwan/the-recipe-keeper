import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// styles
import styles from './Searchbar.module.css';

export default function Searchbar() {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate(`/search?q=${term}`);
  }

  return (
    <div className={styles["search-bar"]}>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          required
          onChange={(e) => setTerm(e.target.value)}
          value={term}
        />
        <button className='btn' type="submit">Search</button>
      </form>
    </div>
  )
}
