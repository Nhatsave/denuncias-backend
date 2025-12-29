// src/common/geocoding/dto/obter-endereco.dto.ts
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class ObterEnderecoDto {
  @IsNumber()
  @Min(-90) @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180) @Max(180)
  longitude: number;

  @IsOptional()
  @IsNumber()
  zoom?: number = 18; // Nível de detalhe (10-18)
}