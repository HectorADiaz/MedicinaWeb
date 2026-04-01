import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importa el componente App
import './index.css';
import { BrowserRouter } from 'react-router-dom';

// Esta es la línea clave que arranca la aplicación
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);