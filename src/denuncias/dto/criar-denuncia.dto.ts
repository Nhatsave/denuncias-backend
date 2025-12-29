
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CriarDenunciaDto {

  @IsString()
  descricao: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  

  @IsArray()
  @IsOptional()
  anexos?: string[];
}

/* import { IsOptional } from "class-validator";

export class CriarDenunciaDto {
  descricao: string;
  tipo: string;
  latitude?: string;
  longitude?: string;
  @IsOptional()
  anexos?: string[]; // opcional
}
*/