import { Pill } from 'lucide-react';

export const MedicationList = () => {
  return (
    <div className="main-container">
      <div className="table-wrapper">
        <div className="table-header">
          <h2>Medicamentos</h2>
          <button className="btn-add" disabled>
            <Pill size={18} />
            Add Med
          </button>
        </div>

        <table className="medicina-table">
          <thead>
            <tr className="columns-table">
              <th>Id</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Categoria</th>
              <th>Tags</th>
              <th>Existencia</th>
              <th className="contain-btn-add"></th>
            </tr>
          </thead>
          <tbody>
            {/* Sin datos aún — pendiente de implementar endpoint de medication */}
          </tbody>
        </table>

        <p className="empty-state">Próximamente: gestión de medicamentos.</p>
      </div>
    </div>
  );
};

export default MedicationList;
