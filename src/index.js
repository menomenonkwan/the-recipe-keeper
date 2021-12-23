import React from 'react';
import ReactDOM from 'react-dom';
import { AuthContextProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
// styles
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
