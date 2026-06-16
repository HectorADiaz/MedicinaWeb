import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { getPersonProvider } from '../services/person';
import { type PersonDTO } from '../services/person/types';

export const usePeople = (isLoggedIn: boolean) => {
  const [error, setError] = useState<string | null>(null);
  const provider = getPersonProvider(isLoggedIn);

  const people = useLiveQuery(() => provider.getAll(), [isLoggedIn]) || [];

  const createPerson = async (data: Omit<PersonDTO, 'id'>) => {
    try {
      setError(null);
      await provider.create(data);
      return { success: true };
    } catch (err: unknown) { // <-- Cambiamos any por unknown
      const message = err instanceof Error ? err.message : "Error al crear el perfil";
      setError(message);
      return { success: false, message};
    }
  };

 const updatePerson = async (data: PersonDTO) => {
    try {
      setError(null);
      await provider.update(data);
      return { success: true };
    } catch {
      const message = "Error al actualizar el perfil";
      setError(message);
      return { success: false, message };
    }
  };

  const deletePerson = async (id: number) => {
    try {
      setError(null);
      await provider.delete(id);
      return { success: true };
    } catch {
      const message = "No se pudo eliminar el perfil";
      setError(message);
      return { success: false, message };
    }
  };

  return {
    people,
    createPerson,
    updatePerson,
    deletePerson,
    error,
    isLoading: people === undefined
  };
};