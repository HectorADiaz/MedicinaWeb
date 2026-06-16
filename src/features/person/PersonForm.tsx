import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePeople } from '../../hooks/usePeople';
import type { PersonCreateDto, PersonUpdateDto, PersonReadDto } from '../../services/person/types';
import '../../features/person/personForm.css';

interface PersonFormData {
  firstName: string;
  lastName: string;
  nickName: string;
  birthday: string;
  email: string;
  phone: string;
}

interface PersonFormProps {
  onSuccess: () => void;
  initialData?: PersonReadDto | null;
  submitText?: string;
}

export const PersonForm = ({ onSuccess, initialData, submitText }: PersonFormProps) => {
  const { createPerson, updatePerson, deletePerson } = usePeople();
  const [localError, setLocalError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PersonFormData>({
    values: initialData
      ? {
          firstName: initialData.firstName ?? '',
          lastName: initialData.lastName ?? '',
          nickName: initialData.nickName ?? '',
          birthday: initialData.birthday?.split('T')[0] ?? '',
          email: initialData.email ?? '',
          phone: initialData.phone ?? '',
        }
      : { firstName: '', lastName: '', nickName: '', birthday: '', email: '', phone: '' },
  });

  useEffect(() => {
    if (!initialData) {
      reset({ firstName: '', lastName: '', nickName: '', birthday: '', email: '', phone: '' });
    }
    setLocalError(null);
  }, [initialData, reset]);

  const onSubmit = async (data: PersonFormData) => {
    setLocalError(null);
    let result;

    if (initialData?.id) {
      const updateDto: PersonUpdateDto = { id: initialData.id, ...data };
      result = await updatePerson(updateDto);
    } else {
      const createDto: PersonCreateDto = data;
      result = await createPerson(createDto);
    }

    if (result.success) {
      reset();
      onSuccess();
    } else {
      setLocalError(result.message || 'Error al procesar la solicitud');
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;

    const fullName = `${initialData.firstName ?? ''} ${initialData.lastName ?? ''}`.trim();
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar a ${fullName}? Esta acción no se puede deshacer.`
    );

    if (confirmed) {
      const result = await deletePerson(initialData.id);
      if (result.success) {
        reset();
        onSuccess();
      } else {
        setLocalError('Error al eliminar');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-person">
      {localError && (
        <div className="error-banner">
          {localError}
        </div>
      )}

      <div className="form-body">
        <div className="input-group">
          <label>Nombre</label>
          <input
            className={`input-form ${errors.firstName ? 'error' : ''}`}
            {...register('firstName', { required: 'El nombre es obligatorio' })}
          />
          {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
        </div>

        <div className="input-group">
          <label>Apellido</label>
          <input
            className={`input-form ${errors.lastName ? 'error' : ''}`}
            {...register('lastName', { required: 'El apellido es obligatorio' })}
          />
          {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
        </div>

        <div className="input-group">
          <label>Apodo</label>
          <input
            className="input-form"
            {...register('nickName')}
          />
        </div>

        <div className="input-group">
          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            max={new Date().toISOString().split('T')[0]}
            className={`input-form ${errors.birthday ? 'error' : ''}`}
            {...register('birthday', { required: 'La fecha de nacimiento es obligatoria' })}
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

        <div className="input-group">
          <label>Teléfono</label>
          <input
            type="tel"
            className="input-form"
            {...register('phone')}
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
