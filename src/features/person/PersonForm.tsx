import { useForm } from 'react-hook-form';
import { db, type Person } from '../../lib/database';
import '../../features/person/personForm.css';
import { useEffect } from 'react';

type PersonFormData = Omit<Person, 'id'>;

interface PersonFormProps {
  onSuccess: () => void;
  initialData?: Person | null ;
  submitText?: string;
}

export const PersonForm = ({ onSuccess, initialData, submitText }: PersonFormProps) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PersonFormData>({
    values: initialData || {name: '', birthDate: '', email: ''},
  });

  useEffect(() => {
    if (!initialData) {
      reset({ name: '', birthDate: '', email: '' });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: PersonFormData) => {
    try {
      if(initialData?.id){
        await db.person.update(initialData.id, data);
        reset();
        onSuccess();
      } else {
        await db.person.add(data);
        reset();
        onSuccess();
       }
    } catch (error) {
      console.error('Error al guardar en MedicinaWeb:', error);
    }
  };
  const handleDelete = async () => {
  if (initialData === null || initialData === undefined || initialData.id === undefined) {
    return;
  }
    const confirmed = window.confirm(
    `¿Estás seguro de eliminar a ${initialData?.name}? Esta acción no se puede deshacer.`
  );
    if(confirmed) {
      try {
        await db.person.delete(initialData?.id);
        reset();
        onSuccess();
      } catch (error) {
        console.error('Error al eliminar en MedicinaWeb:', error);
      }
    } 
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-person">
      
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

        <button type="submit" 
        className={`btn-add ${initialData?.id ? 'btn-edit' : ''}`}
        disabled={isSubmitting}>
          {isSubmitting 
            ? 'Guardando...' 
            : submitText 
          }   
        </button>
      </div>

    </form>
  );
};