export interface PersonDTO {
  id?: number;
  name: string;
  birthDate: string;
  email: string;
}

export interface PersonStats {
  count: number;
  limit: number;
  isFull: boolean;
}