// src/lib/database.ts
import Dexie from 'dexie';
import type { Table } from 'dexie';

/* ========= TIPOS ========= */
export interface Person {
  id?: number;
  name: string;
  birthDate: string;
  email?: string;
  phone?: string; //FALTO AGREGARLO
  notes?: string; //FALTO AGREGARLO
}

export interface MedicationTag {
  id?: number;
  name: string;
}


export type Unit = 'pastilla' | 'mg' | 'ml' | 'inyección' | 'pomada' | 'cápsula' | 'gotas' | 'otra';
export const UNIT_OPTIONS: Unit[] = ['pastilla', 'mg', 'ml', 'inyección', 'pomada', 'cápsula', 'gotas', 'otra'];

export interface MedicationTagRelation {
  id?: number;
  medicationId: number;
  tagId: number;
}

export interface PersonCategory {
  id?: number;
  name: string;
}

export interface Medication {
  id?: number;
  name: string;
  brand: string;
  personCategoryId: number;
  AmountDosage: string;
  DosageId: number;  
  MedicationTag: number[];
  route?: 'oral' | 'iv' | 'topical';
  
  // Notas e historial
  prescriptionNotes: string;
  recommendedUsage: string;
  
  // Control de Inventario Físico
  purchaseDate: string;   
  expiryDate: string;
  initialStock: number;
  currentStock: number;
}

 
type ScheduleMode = 'intervalos' | 'vecesPorDia' | 'díasDeLaSemana' | 'cíclico';

interface Regimen {
  id?: number;
  personId: number;
  medicationId: number;
  mode: ScheduleMode;
  startAtISO: string;
  endAtISO?: string;
  durationDays?: number;

  // intervalos
  intervalHours?: number;

  // veces por día
  timesPerDay?: string[]; 

  // días de la semana
  weekdays?: number[];    

  // cíclico 
  cycleOnDays?: number;
  cycleOffDays?: number; 
}
export type DoseStatus = 'pendiente' | 'hecho' | 'saltado' | 'perdido';

export interface Dose {
  id?: number;
  personId: number;
  medicationId: number;
  regimenId: number;
  dueAt: number;
  takenAt?: number;
  status: DoseStatus;
  label: string;
 
}

/* ========= DB ========= */
class MedicinaWebDB extends Dexie {
  person!: Table<Person>;
  medication!: Table<Medication>;
  regimen!: Table<Regimen>;
  dose!: Table<Dose>;

  constructor() {
    super('MedicinaWebDB');
    this.version(1).stores({
      person: '++id, name, birthDate, email, phone, notes',
    });
  }
}

export const db = new MedicinaWebDB();
