import { Pill } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../lib/database";



export const MedicationList = () => {
    const medication = useLiveQuery(() => db.medication.toArray());
 
   return (
    
    <div className="main-container">
      <div className="table-wrapper">
        <div className="table-header">
          <h2>Medicamentos</h2>
          {/* <button className="btn-add" onClick={handleAddNew}> */}
          <button className="btn-add">
            <Pill size={18} />
              Add Med
          </button>
        </div>

        <table className="medicina-table">
          <thead>
            <tr className='columns-table'>
              <th>Id</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Categoria</th>
              <th>Tags</th>
              <th>Existencia</th>
              <th className='contain-btn-add'></th>
            </tr>
          </thead>
          <tbody>
            {medication?.map((medication) => (
              <tr key={medication.id}>
                <td>{medication.name}</td>
                <td>{medication.brand}</td>
                <td>{medication.personCategoryId}</td>
                <td>{medication.MedicationTag}</td>
                <td>{medication.currentStock}</td>
                <td className='accion-table'>
                  <button className="btn-edit" >Editar </button>
                  <button className="btn-track">Ver Seguimiento</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setEditingPerson(null);
          }}
          title={editingPerson ? "Editar Perfil" : "Agregar Nueva Persona"}
        >
        <PersonForm onSuccess={() => {
          setIsModalOpen(false);
          setEditingPerson(null);
        }}
          submitText={editingPerson ? "Guardar Cambios" : "Crear Nuevo Perfil"}
          initialData={editingPerson}
        />
        </Modal> */}
        {medication?.length === 0 && (
          <p className="empty-state">Aún no has agregado ningún Medicamento.</p>
        )}
      </div>
    </div>




  );
};

export default MedicationList;

