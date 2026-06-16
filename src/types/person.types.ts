import type {components} from './api-schema';

// Extraemos los alias limpios directamente del esquema autogenerado de Swagger
export type PersonReadDto = components["schemas"]["PersonReadDto"];
export type PersonCreateDto = components["schemas"]["PersonCreateDto"];
export type PersonUpdateDto = components["schemas"]["PersonUpdateDto"];
export type BiometricReadDto = components["schemas"]["BiometricReadDto"];

// Tipado estricto para el formato envoltorio estandarizado del API de .NET
export interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string | null;
    data: T;
    errors: string[] | null;
}