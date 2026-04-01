import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/layout/Layout';
import PersonList from './features/person/PersonList';  

// Placeholders por ahora
const DashboardView = () => <h2>Dashboard (Tomas Pendientes)</h2>;
const MedicationsView = () => <h2>Gestión de Medicamentos</h2>;
const TreatmentsView = () => <h2>Gestión de Tratamientos</h2>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardView />} />
        <Route path="personas" element={<PersonList />} />
        <Route path="medicamentos" element={<MedicationsView />} />
        <Route path="tratamientos" element={<TreatmentsView />} />
        <Route path="*" element={<h2>404: Página No Encontrada</h2>} />
      </Route>
    </Routes>
  );
}
