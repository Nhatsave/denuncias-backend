// src/auth/dto/create-user.dto.ts
import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() nome: string;
  @IsNotEmpty() apelido: string;
  @IsNotEmpty() local_nascimento: string;
  @IsNotEmpty() data_nascimento: Date;
  @IsNotEmpty() genero: string;
  @IsNotEmpty() contacto: string;
  @IsNotEmpty() residenciaActual: string

  @IsEmail() email: string;
  @IsNotEmpty() senha: string;

  @IsEnum(['usuario', 'agente', 'admin', 'monitor'])
  perfil?: 'usuario' | 'agente' | 'admin' | 'monitor';
}

 // src/auth/dto/create-agente.dto.ts
export class CreateFuncionarioDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  apelido: string;

  @IsString()
  local_nascimento: string;

  @IsString()
  data_nascimento: string;

  @IsString()
  genero: string;

  @IsString()
  contacto: string;

  @IsString()
  email: string;

  @IsString()
  senha: string;

  @IsString()
    departamento: string;

  @IsString()
    categoria: string;

  @IsString()
    nip: string;

  // Role será definida no momento do registro (ex: 'admin', 'monitor', 'agente')
  @IsIn(['admin', 'monitor', 'agente'])
  perfil: 'admin' | 'monitor' | 'agente';
}


export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  senha: string;
}
