// src/auth/auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {  CreateFuncionarioDto, CreateUserDto, UpdatePasswordDto, UpdatePasswordEsquecidaDto, ValidacaoCodeDto } from './dto/usuarioGeral.dto';
import { CodigoValidacao, Funcionario, Pessoa, Usuario } from './entities/geral.entity';
import { FuncionarioResponseDto } from './dto/usuarioGeralResposta';
import { EmailService } from 'src/email/email.service';
import * as jwt from 'jsonwebtoken';
import { Roles } from './decorators/roles.decorator';
import * as crypto from 'crypto';
 

/**
 * Gera um hash SHA-256 de uma string
 * @param dado String de entrada
 * @returns Hash hexadecimal
 */
export function hashDados(dado: string): string {
  return crypto.createHash('sha256').update(dado).digest('hex');
}


  @Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Funcionario) private readonly funcionarioRepo: Repository<Funcionario>,
    @InjectRepository(Pessoa) private readonly pessoaRepo: Repository<Pessoa>,
    
    @InjectRepository(CodigoValidacao)
    private readonly codigoRepo: Repository<CodigoValidacao>,
    
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ) {}

  // Registro de usuário comum
  async createUsuario(dto: CreateUserDto): Promise<Usuario> {

     // Verifica se já existe usuário com o mesmo email
  const existingUser = await this.usuarioRepo.findOne({ where: { email: dto.email } });
  if (existingUser) {
    throw new BadRequestException('Email já cadastrado');
  }


    const pessoa = this.pessoaRepo.create({ ...dto });
    await this.pessoaRepo.save(pessoa);

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    const usuario = this.usuarioRepo.create({
      pessoa,
      email: dto.email,
      residenciaActual: dto.residenciaActual,
      senha: senhaHash,
    });

    return this.usuarioRepo.save(usuario);
  }

  // Registro de funcionário
async createFuncionario(dto: CreateFuncionarioDto): Promise<FuncionarioResponseDto> {
     // Verifica se já existe funcionário com o mesmo email
  const existingFuncionario = await this.funcionarioRepo.findOne({ where: { email: dto.email } });
  if (existingFuncionario) {
    throw new BadRequestException('Email já cadastrado');
  }
  
  // 1. Cria pessoa
  const pessoa = this.pessoaRepo.create({
    nome: dto.nome,
    apelido: dto.apelido,
    local_nascimento: dto.local_nascimento,
    data_nascimento: dto.data_nascimento,
    genero: dto.genero,
    contacto: dto.contacto,
  });
  await this.pessoaRepo.save(pessoa);

  // 2. Criptografa senha
  const senhaHash = await bcrypt.hash(dto.senha, 10);

  // 3. Cria funcionário
  const funcionario = this.funcionarioRepo.create({
    pessoa,                 // relação OneToOne
    email: dto.email,
    senha: senhaHash,
    nip: dto.nip,
    categoria: dto.categoria,
    departamento: dto.departamento,
    perfil: dto.perfil || 'funcionario',
  });

  // 4. Salva no banco
 this.funcionarioRepo.save(funcionario);

   // 4. Retorna apenas os dados essenciais
  return {
    id_funcionario: funcionario.id_funcionario,
    email: funcionario.email,
    perfil: funcionario.perfil,
    nome: pessoa.nome,
    apelido: pessoa.apelido,
    contacto: pessoa.contacto,
    estado: "Cadastro feito com sucesso"
  };
}

// src/auth/auth.service.ts - CORRIJA O LOGIN
async login(email: string, senha: string) {
  // 1. Valida email/senha
  const usuario = await this.validateCidadao(email, senha);
  if (!usuario) throw new UnauthorizedException('Email ou senha incorretos');

  // 2. Cria payload do JWT
  const payload = {
    sub: usuario.id_usuario,
    email: usuario.email,
    nome: usuario.pessoa?.nome,
    role: 'cidadao', // Importante para RolesGuard
    tipo: 'cidadao',
  };

  // 3. Gera token de acesso
  const access_token = this.jwtService.sign(payload);

  // 4. Gera refresh token (opcional)
  const refresh_token = this.jwtService.sign(
    { sub: usuario.id_usuario, type: 'refresh' },
    { expiresIn: '7d' }
  );

  return {
    access_token,
    refresh_token,
    expires_in: 3600,
    usuario: {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      nome: usuario.pessoa?.nome,
      role: 'cidadao',
    },
  };
}

 async loginFuncionario(nip: string, senha: string) {
  const funcionario = await this.validateFuncionario(nip, senha);
  if (!funcionario) throw new UnauthorizedException('Email ou senha incorretos');

  const access_token = this.generateAccessToken(funcionario);
  const refresh_token = this.generateRefreshToken(funcionario);

  console.log('Perfil do funcionario: ', funcionario.perfil)
    const payload = {
    sub: funcionario.id_funcionario, // 🔴 ID do funcionário
    tipo: 'monitor',
    email: funcionario.email,
    role: funcionario.perfil, // admin | monitor | agente
  };

  return {
    access_token: this.jwtService.sign(payload),
    refresh_token,
    expires_in: 3600,
    usuario: {
      id_usuario: funcionario.id_usuario,
      email: funcionario.email,
      nome: funcionario.pessoa?.nome,
    },
  };
}
 
//    ALTERAR SENHA
async alterarSenha(userId: number, dto: UpdatePasswordDto) {
  const cidadao = await this.getMe(userId)
    const id = cidadao.id;
    console.log('Metodo alterar senha: ', 'ID: ' + id)
  const usuario = await this.usuarioRepo.findOne({ where: { id_usuario: id } });

  if (!usuario) {
    throw new NotFoundException('Usuário não encontrado');
  }

  // Verifica se a senha atual confere
  const senhaConfere = await bcrypt.compare(dto.senhaActual, usuario.senha);

  if (!senhaConfere) {
    throw new BadRequestException('Senha actual incorreta');
  }

  // Gera novo hash
  const novaSenhaHash = await bcrypt.hash(dto.novaSenha, 10);
  usuario.senha = novaSenhaHash;
  await this.usuarioRepo.save(usuario);

  return {
    message: 'Senha alterada com sucesso'
  };
}
 
async alterarSenhaEsquecida(dto: UpdatePasswordEsquecidaDto) {
  // 1️⃣ Busca o usuário pelo e-mail
  const dados = await this.getMyMail(dto.email); // retorna {id, email, nome, apelido}
  const usuario = await this.usuarioRepo.findOne({ where: { email: dados.email } });

  if (!usuario) {
    throw new NotFoundException('Usuário não encontrado');
  }

  // 2️⃣ Busca o código de validação mais recente para o usuário
  const codigoRegistro = await this.codigoRepo.findOne({
    where: {
      usuario: { id_usuario: usuario.id_usuario },
      codigo: dto.codigoValidacao,
    },
    order: { criadoEm: 'DESC' }, // garante pegar o mais recente
  });

  if (!codigoRegistro) {
    throw new BadRequestException('Código de validação inválido');
  }

  // 3️⃣ Verifica se ainda não expirou
  const agora = new Date();
  if (codigoRegistro.expireTime < agora) {
    throw new BadRequestException('Código de validação expirado');
  }

  // 4️⃣ Gera novo hash da senha
  const novaSenhaHash = await bcrypt.hash(dto.novaSenha, 10);
  usuario.senha = novaSenhaHash;
  await this.usuarioRepo.save(usuario);

  // 5️⃣ Opcional: deletar ou invalidar o código usado
  await this.codigoRepo.delete({ id: codigoRegistro.id });

  return {
    message: 'Senha alterada com sucesso',
  };
}


async EnviarMail(dto: ValidacaoCodeDto) {
  let codigo = '';
  const dados = await this.getMyMail(dto.email); // retorna dados do usuário, incluindo id_usuario

  if (dto.email === dados.email && dto.nome === dados.nome && dto.apelido === dados.apelido) {
    // gerar código aleatório de 6 dígitos
    codigo = await this.gerarCodigo6Digitos();

    // criar registro de código de validação
    const codigoValidacao = this.codigoRepo.create({
      usuario: { id_usuario: dados.id }, // relacionamento com o usuário
      codigo: codigo,
      expireTime: new Date(Date.now() + 10 * 60 * 1000), // expira em 10 minutos
    });

    await this.codigoRepo.save(codigoValidacao);
  }

  await this.emailService.enviarEmail(
    dto.email,
    'Alo Transito',
    `O código de restauração da senha é ${codigo}. Se você não requisitou, pode ignorar esta mensagem.`
  );

  return { message: 'Código enviado para o seu e-mail, verifique a caixa de entrada e spam' };
}

async gerarCodigo6Digitos() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // gera número entre 100000 e 999999
}

 async getMe(userId: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { id_usuario: userId },
      relations: ['pessoa'],
      select: ['id_usuario', 'email', 'residenciaActual'],
    });
    
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    return {
      id: usuario.id_usuario,
      email: usuario.email,
      nome: usuario.pessoa.nome,
      apelido: usuario.pessoa.apelido,
      contacto: usuario.pessoa.contacto,
      residencia: usuario.residenciaActual,
      
    };
  }
 async getMyMail(email: string) {
    const usuario = await this.usuarioRepo.findOne({
      where: { email: email },
      relations: ['pessoa'],
      select: ['id_usuario', 'email', 'residenciaActual'],
    });
    
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    return {
      id: usuario.id_usuario,
      email: usuario.email,
      nome: usuario.pessoa.nome,
      apelido: usuario.pessoa.apelido,
      //contacto: usuario.pessoa.contacto,
      //residencia: usuario.residenciaActual,
      
    };
  }
// Renova o token usando refresh token
 async refreshToken(oldRefreshToken: string) {
  try {
    // Usa verifyAsync para verificação assíncrona
    const payload = await this.jwtService.verifyAsync(oldRefreshToken);
    
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Tipo de token inválido');
    }

    // Busca o usuário no banco para verificar se ainda existe
    const usuario = await this.usuarioRepo.findOne({
      where: { id_usuario: payload.sub },
      relations: ['pessoa'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Verifica se o email ainda é o mesmo (segurança extra)
    if (usuario.email !== payload.email) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gera novos tokens
    const access_token = await this.generateAccessToken(usuario);
    const refresh_token = await this.generateRefreshToken(usuario);

    return {
      access_token,
      refresh_token,
      expires_in: 3600, // 1 hora
      token_type: 'Bearer',
    };
  } catch (error) {
    // Log do erro para debug (opcional)
    console.error('Erro no refresh token:', error.message);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
    throw error;
  }
}

 /*
  async validateUser(email: string, senha: string): Promise<Usuario | null> {
    const user = await this.usuarioRepo.findOne({
      where: { email },
      relations: ['pessoa'],
    });

    if (user && (await bcrypt.compare(senha, user.senha))) {
      return user;
    }
    return null;
  }

  // Gera token de acesso
  private async generateAccessToken(usuario: Usuario): Promise<string> {
    const payload = { 
      sub: usuario.id_usuario, 
      email: usuario.email,
      type: 'access'
    };
    
    return this.jwtService.sign(payload);
  }

  // Gera refresh token
  private async generateRefreshToken(usuario: Usuario): Promise<string> {
    const payload = { 
      sub: usuario.id_usuario, 
      email: usuario.email,
      type: 'refresh'
    };
    
    return this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh token vale por 7 dias
    });
  }

  // Renova o token usando refresh token
 async refreshToken(oldRefreshToken: string) {
  try {
    // Usa verifyAsync para verificação assíncrona
    const payload = await this.jwtService.verifyAsync(oldRefreshToken);
    
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Tipo de token inválido');
    }

    // Busca o usuário no banco para verificar se ainda existe
    const usuario = await this.usuarioRepo.findOne({
      where: { id_usuario: payload.sub },
      relations: ['pessoa'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Verifica se o email ainda é o mesmo (segurança extra)
    if (usuario.email !== payload.email) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gera novos tokens
    const access_token = await this.generateAccessToken(usuario);
    const refresh_token = await this.generateRefreshToken(usuario);

    return {
      access_token,
      refresh_token,
      expires_in: 3600, // 1 hora
      token_type: 'Bearer',
    };
  } catch (error) {
    // Log do erro para debug (opcional)
    console.error('Erro no refresh token:', error.message);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
    throw error;
  }
}

  // Valida token (para usar em guards)
  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  */
 /**
   * Valida email e senha do usuário
   */
  public async validateCidadao(email: string, senha: string): Promise<any> {
    const usuario = await this.usuarioRepo.findOne({
      where: { email },
      relations: ['pessoa'],
    });

    if (!usuario) return null;

    // Compare senha (ajuste conforme seu hash)
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    return senhaValida ? usuario : null;
  }

   public async validateFuncionario(nip: string, senha: string): Promise<any> {
    const funcionario = await this.funcionarioRepo.findOne({
      where: { nip },
      relations: ['pessoa'],
    });

    if (!funcionario) return null;

    // Compare senha (ajuste conforme seu hash)
    const senhaValida = await bcrypt.compare(senha, funcionario.senha);
    return senhaValida ? funcionario : null;
  }

  private generateAccessToken(usuario: any): string { // ← Deve retornar STRING
  const payload = {
    sub: usuario.id_usuario,
    email: usuario.email,
    nome: usuario.pessoa?.nome || usuario.nome,
    roles: usuario.roles || ['user'],
  };

  // Retorna a STRING do token, não um objeto
  return this.jwtService.sign(payload, {
    expiresIn: '1h',
    secret: process.env.JWT_SECRET || 'secreto-dev',
  });
}

private generateRefreshToken(usuario: any): string { // ← Deve retornar STRING
  const payload = {
    sub: usuario.id_usuario,
    type: 'refresh',
  };

  // Retorna a STRING do token
  return this.jwtService.sign(payload, {
    expiresIn: '7d',
    secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'refresh-secreto',
  });
}



// Retorna usuário comum pelo ID
public async findUsuarioById(id: number) {
  return this.usuarioRepo.findOne({
    where: { id_usuario: id },
    relations: ['pessoa'],
  });
}

// Retorna funcionário pelo ID
public async findFuncionarioById(id: number) {
  return this.funcionarioRepo.findOne({
    where: { id_funcionario: id },
    relations: ['pessoa'],
  });
}

}