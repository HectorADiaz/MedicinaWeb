
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Person } from '../../lib/database';
import { Modal } from '../../components/common/Modal';
import { PersonForm } from './PersonForm';
import { UserPlus  } from 'lucide-react';
import './PersonList.css';


export const PersonList = () => {
  //Add
  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const people = useLiveQuery(() => db.person.toArray());
  
  //Edit
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const handleEdit = (person : Person) => {
    setEditingPerson(person);
    setIsModalOpen(true);
  };
  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};



  return (
    <div className="main-container">
      <div className="table-wrapper">
        <div className="table-header">
          <h2>Perfiles</h2>
          <button className="btn-add" onClick={handleAddNew}>
            <UserPlus size={18} />
              Add Person
          </button>
        </div>

        <table className="medicina-table">
          <thead>
            <tr className='columns-table'>
              <th>Nombre</th>
              <th>Fecha de Nacimiento</th>
              <th>Edad</th>
              <th>Correo Electrónico</th>
              <th className='contain-btn-add'></th>
            </tr>
          </thead>
          <tbody>
            {people?.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{formatDate(person.birthDate)}</td>
                <td>{calculateAge(person.birthDate)} años</td>
                <td>{person.email}</td>
                <td className='accion-table'>
                  <button className="btn-edit" onClick={()=> handleEdit(person)}>Editar </button>
                  <button className="btn-track">Ver Seguimiento</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal 
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
        </Modal>
        {people?.length === 0 && (
          <p className="empty-state">Aún no has agregado ningún perfil.</p>
        )}
      </div>
    </div>
  );
};

export default PersonList;

