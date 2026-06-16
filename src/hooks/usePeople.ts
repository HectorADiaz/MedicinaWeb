import { useState, useEffect, useCallback } from 'react';
import { personProvider } from '../services/person';
import type { PersonReadDto, PersonCreateDto, PersonUpdateDto } from '../services/person/types';

export function usePeople() {
  const [people, setPeople] = useState<PersonReadDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPeople = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await personProvider.getAll();
      setPeople(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar perfiles';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  const createPerson = async (data: PersonCreateDto) => {
    try {
      setError(null);
      await personProvider.create(data);
      await fetchPeople();
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear el perfil';
      setError(message);
      return { success: false, message };
    }
  };

  const updatePerson = async (data: PersonUpdateDto) => {
    try {
      setError(null);
      await personProvider.update(data);
      await fetchPeople();
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar el perfil';
      setError(message);
      return { success: false, message };
    }
  };

  const deletePerson = async (id: number) => {
    try {
      setError(null);
      await personProvider.delete(id);
      await fetchPeople();
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudo eliminar el perfil';
      setError(message);
      return { success: false, message };
    }
  };

  return { people, isLoading, error, createPerson, updatePerson, deletePerson };
}
