import { db, type Person as PersonEntity } from '../../lib/database'; 
import { type PersonDTO, type PersonStats } from './types';
import { type IPersonProvider } from './IPersonProvider';
// Regla de negocio local
const GUEST_LIMIT = 2;

export const OfflinePersonProvider: IPersonProvider = {
  
  async getAll(): Promise<PersonDTO[]> {
    const data = await db.person.toArray();
    // Retornamos los datos como DTOs
    return data as PersonDTO[]; 
  },
  
  async getById(id: number): Promise<PersonDTO | undefined> {
    const person = await db.person.get(id);
    return person as PersonDTO | undefined;
  },

  async create(person: Omit<PersonDTO, 'id'>): Promise<number> {
    const stats = await this.getStats();
    if (stats.isFull) {
      throw new Error(`Límite alcanzado: Como invitado solo puedes crear ${GUEST_LIMIT} perfiles.`);
    }

    // 2. Mapeamos al tipo de la Entidad (PersonEntity)
    // Esto hace que TypeScript valide que no falte ningún campo de la DB
    const newRecord: Omit<PersonEntity, 'id'> = {
      name: person.name,
      birthDate: person.birthDate,
      email: person.email,
    };

    // 3. Al usar el tipo correcto, ya no necesitas 'as any'
    const id = await db.person.add(newRecord as PersonEntity);
    return id as number;
  },

  async update(person: PersonDTO): Promise<void> {
    if (!person.id) throw new Error("Se requiere un ID para actualizar");
    
    // Para el update, casteamos a la entidad completa
    await db.person.put(person as PersonEntity);
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