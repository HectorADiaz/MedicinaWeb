import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/MainLayout/MainLayout';
import PersonList from './features/person/PersonList';
import MedicationList from './features/medication/MedicationList';

// Placeholders por ahora
const DashboardView = () => <h2>Dashboard (Tomas Pendientes)</h2>;
const TreatmentsView = () => <h2>Gestión de Tratamientos</h2>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardView />} />
        <Route path="personas" element={<PersonList />} />
        <Route path="medicamentos" element={<MedicationList />} />
        <Route path="tratamientos" element={<TreatmentsView />} />
        <Route path="*" element={<h2>404: Página No Encontrada</h2>} />
      </Route>
    </Routes>
  );
}
