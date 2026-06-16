import type { IPersonProvider } from './IPersonProvider';
import type { PersonReadDto, PersonCreateDto, PersonUpdateDto } from './types';
import type { ApiResponse } from '../../types/person.types';

const BASE_URL = import.meta.env.VITE_API_URL as string;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (response.status === 204) return undefined as T;

  const body: ApiResponse<T> = await response.json();

  if (!response.ok || !body.success) {
    throw new Error(body.message || `Error HTTP ${response.status}`);
  }

  return body.data as T;
}

export const OnlinePersonProvider: IPersonProvider = {
  async getAll(): Promise<PersonReadDto[]> {
    return request<PersonReadDto[]>('/api/Person');
  },

  async getById(id: number): Promise<PersonReadDto | undefined> {
    return request<PersonReadDto>(`/api/Person/${id}`);
  },

  async create(person: PersonCreateDto): Promise<PersonReadDto> {
    return request<PersonReadDto>('/api/Person', {
      method: 'POST',
      body: JSON.stringify(person),
    });
  },

  async update(person: PersonUpdateDto): Promise<void> {
    await request<PersonReadDto>(`/api/Person/${person.id}`, {
      method: 'PUT',
      body: JSON.stringify(person),
    });
  },

  async delete(id: number): Promise<void> {
    await request<void>(`/api/Person/${id}`, { method: 'DELETE' });
  },
};
