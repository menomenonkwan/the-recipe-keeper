import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogin } from '../hooks/useLogin';
// styles 
import styles from './Login.module.css';

export default function Login({ open, setOpen }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, isLoading, login } = useLogin();
  const { user } = useAuthContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);

    if (user) {
      setOpen(false);
    }
  }

  return (
    <div className={`${styles['login-form']} ${open ? '' : styles.hidden}`}>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Email:</span>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          <span>Password:</span>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        {!isLoading && <button className="btn" type="submit">Login</button>}
        {isLoading && <button className="btn" disabled>Loading</button>}
        {error && <p className='error'>{ error }</p>}
      </form>
    </div>
  )
}
