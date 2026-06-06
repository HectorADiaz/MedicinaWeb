import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePeople } from '../../hooks/usePeople'; // Importamos el Hook
import { PersonDTO } from '../../services/person/types'; // Importamos el DTO
import '../../features/person/personForm.css';

interface PersonFormProps {
  onSuccess: () => void;
  initialData?: PersonDTO | null; // Usamos DTO
  submitText?: string;
}

export const PersonForm = ({ onSuccess, initialData, submitText }: PersonFormProps) => {
  // 1. Extraemos las funciones del Hook
  const { createPerson, updatePerson, deletePerson } = usePeople(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PersonDTO>({
    values: initialData || { name: '', birthDate: '', email: '' },
  });

  useEffect(() => {
    if (!initialData) {
      reset({ name: '', birthDate: '', email: '' });
    }
    setLocalError(null);
  }, [initialData, reset]);

  // 2. Nueva lógica de Guardado usando el Hook
  const onSubmit = async (data: PersonDTO) => {
    setLocalError(null);
    let result;

    if (initialData?.id) {
      result = await updatePerson({ ...data, id: initialData.id });
    } else {
      result = await createPerson(data);
    }

    if (result.success) {
      reset();
      onSuccess();
    } else {
      // 3. Aquí es donde se atrapa el error de "Límite de 2"
      setLocalError(result.message || "Error al procesar la solicitud");
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar a ${initialData.name}? Esta acción no se puede deshacer.`
    );

    if (confirmed) {
      const result = await deletePerson(initialData.id);
      if (result.success) {
        reset();
        onSuccess();
      } else {
        setLocalError("Error al eliminar");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-person">
      
      {/* 4. Banner de Error para el Límite */}
      {localError && (
        <div className="error-banner">
          {localError}
        </div>
      )}

      <div className="form-body">
        <div className="input-group">
          <label>Nombre Completo</label>
          <input 
            className={`input-form ${errors.name ? 'error' : ''}`}
            {...register('name', { required: 'El nombre es obligatorio' })} 
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>

        <div className="input-group">
          <label>Fecha de Nacimiento</label>
          <input 
            type="date"
            max={new Date().toISOString().split("T")[0]}
            className={`input-form ${errors.birthDate ? 'error' : ''}`}
            {...register('birthDate', { required: 'La fecha de nacimiento es obligatoria' })} 
          />
        </div>

        <div className="input-group">
          <label>Correo Electrónico</label>
          <input 
            type="email"
            className={`input-form ${errors.email ? 'error' : ''}`}
            {...register('email', { required: 'El correo es obligatorio' })} 
          />
        </div>
      </div>

      <div className="form-actions">
        {initialData?.id && (
          <button type="button" className="btn-delete" onClick={handleDelete}>
            Eliminar Perfil
          </button>
        )}

        <button 
          type="submit" 
          className={`btn-add ${initialData?.id ? 'btn-edit' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : (submitText || 'Guardar')}   
        </button>
      </div>
    </form>
  );
};