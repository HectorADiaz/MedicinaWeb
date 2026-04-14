import { db, type Person } from '../../lib/database';
import type { IPersonProvider, PersonStats } from './IPersonProvider';

// Regla de negocio: Límite para usuarios no logueados
const GUEST_LIMIT = 2;

export const OfflinePersonProvider: IPersonProvider = {
  
  async getAll(): Promise<Person[]> {
    return await db.person.toArray();
  },

  async getById(id: number): Promise<Person | undefined> {
    return await db.person.get(id);
  },

  async create(person: Omit<Person, 'id'>): Promise<number> {
    // 1. Validar límite antes de guardar
    const stats = await this.getStats();
    if (stats.isFull) {
      throw new Error(`Límite alcanzado: Como invitado solo puedes crear ${GUEST_LIMIT} perfiles.`);
    }

    // 2. Guardar en la base de datos local
    return await db.person.add(person as Person);
  },

  async update(person: Person): Promise<void> {
    if (!person.id) throw new Error("Se requiere un ID para actualizar");
    await db.person.put(person);
  },

  async delete(id: number): Promise<void> {
    await db.person.delete(id);
  },

  async getStats(): Promise<PersonStats> {
    const count = await db.person.count();
    return {
      count,
      limit: GUEST_LIMIT,
      isFull: count >= GUEST_LIMIT
    };
  }
};