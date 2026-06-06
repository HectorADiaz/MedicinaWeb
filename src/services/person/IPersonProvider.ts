// src/services/person/IPersonProvider.ts
import { type PersonDTO } from './types';

export interface PersonStats {
  count: number;
  limit: number;
  isFull: boolean;
}

export interface IPersonProvider {
  getAll(): Promise<PersonDTO[]>;

  getById(id: number): Promise<PersonDTO | undefined>;
 
  create(person: Omit<PersonDTO, 'id'>): Promise<number | string>;

  update(person: PersonDTO): Promise<void>;

  delete(id: number): Promise<void>;

  getStats(): Promise<PersonStats>;
}