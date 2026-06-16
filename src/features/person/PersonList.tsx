import { useState } from 'react';
import { usePeople } from '../../hooks/usePeople';
import { Modal } from '../../components/common/Modal';
import { PersonForm } from './PersonForm';
import { UserPlus } from 'lucide-react';
import type { PersonReadDto } from '../../services/person/types';
import './PersonList.css';

export const PersonList = () => {
  const { people, isLoading, deletePerson } = usePeople();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<PersonReadDto | null>(null);

  const calculateAge = (birthday: string): number => {
    const birth = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleEdit = (person: PersonReadDto) => {
    setEditingPerson(person);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingPerson(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPerson(null);
  };

  if (isLoading) return <div className="main-container"><p>Cargando perfiles...</p></div>;

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
              <th>Apellido</th>
              <th>Fecha de Nacimiento</th>
              <th>Edad</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th className='contain-btn-add'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id}>
                <td>{person.firstName}</td>
                <td>{person.lastName}</td>
                <td>{person.birthday ? formatDate(person.birthday) : '-'}</td>
                <td>{person.birthday ? `${calculateAge(person.birthday)} años` : '-'}</td>
                <td>{person.email}</td>
                <td>{person.phone}</td>
                <td className='accion-table'>
                  <button className="btn-edit" onClick={() => handleEdit(person)}>Editar</button>
                  <button className="btn-track">Ver Seguimiento</button>
                  <button
                    className="btn-delete"
                    onClick={() => person.id && deletePerson(person.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingPerson ? 'Editar Perfil' : 'Agregar Nueva Persona'}
        >
          <PersonForm
            onSuccess={closeModal}
            submitText={editingPerson ? 'Guardar Cambios' : 'Crear Nuevo Perfil'}
            initialData={editingPerson}
          />
        </Modal>

        {people.length === 0 && (
          <p className="empty-state">Aún no has agregado ningún perfil.</p>
        )}
      </div>
    </div>
  );
};

export default PersonList;
