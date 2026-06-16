import type { PersonReadDto, PersonCreateDto, PersonUpdateDto } from './types';

export interface IPersonProvider {
  getAll(): Promise<PersonReadDto[]>;
  getById(id: number): Promise<PersonReadDto | undefined>;
  create(person: PersonCreateDto): Promise<PersonReadDto>;
  update(person: PersonUpdateDto): Promise<void>;
  delete(id: number): Promise<void>;
}
