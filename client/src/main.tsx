import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthProvider';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter basename='/'>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
