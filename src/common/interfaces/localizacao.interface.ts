// src/common/geocoding/interfaces/localizacao.interface.ts
export interface Localizacao {
  endereco: string;
  bairro?: string;
  cidade: string;
  provincia: string;
  pais: string;
  codigoPostal?: string;
  latitude: number;
  longitude: number;
  pontoReferencia?: string;
  rua?: string;
  numero?: string;
}