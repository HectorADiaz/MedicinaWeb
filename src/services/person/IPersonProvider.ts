// src/services/person/IPersonProvider.ts
import { type Person } from '../../lib/database';

export interface PersonStats {
  count: number;
  limit: number;
  isFull: boolean;
}

export interface IPersonProvider {
  getAll(): Promise<Person[]>;

  getById(id: number): Promise<Person | undefined>;
 
  create(person: Omit<Person, 'id'>): Promise<number | string>;

  update(person: Person): Promise<void>;

  delete(id: number): Promise<void>;

  getStats(): Promise<PersonStats>;
}