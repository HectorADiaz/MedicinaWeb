import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout-container">
      <Sidebar />

      <header className="mobile-header">
        <h3>MedicinaWeb</h3>
        <button className="hamburger-button">☰</button>
      </header>

      <div className="content-area">
        <Outlet />
      </div>
    </div>
  );
}
