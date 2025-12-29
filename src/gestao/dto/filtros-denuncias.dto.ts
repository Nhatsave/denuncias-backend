// src/gestao/dto/filtros-denuncias.dto.ts
import { IsOptional, IsEnum, IsDateString, IsString, IsNumber, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusDenuncia } from 'src/denuncias/enums/status-denuncia.enum';

export class FiltrosDenuncias {
  @IsOptional()
  @IsEnum(StatusDenuncia)
  status?: StatusDenuncia;

  @IsOptional()
  @IsUUID()
  categoriaId?: string;

  @IsOptional()
  @IsDateString()
  dataInicio?: Date;

  @IsOptional()
  @IsDateString()
  dataFim?: Date;

  @IsOptional()
  @IsString()
  busca?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pagina?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limite?: number = 10;
}