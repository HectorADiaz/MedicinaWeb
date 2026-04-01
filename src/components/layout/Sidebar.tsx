import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const cls = ({ isActive }: { isActive: boolean }) =>
    'sidebar-link' + (isActive ? ' active' : '');

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">MedicinaWeb</h3>
      <nav className="sidebar-nav">
        <NavLink className={cls} to="/">Dashboard</NavLink>
        <NavLink className={cls} to="/personas">Personas</NavLink>
        <NavLink className={cls} to="/medicamentos">Medicamentos</NavLink>
      </nav>
    </aside>
  );
}
