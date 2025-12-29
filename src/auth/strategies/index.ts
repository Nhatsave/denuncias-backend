// src/auth/strategies/index.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategyBase, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';

/** -------------------- Local Cidadão -------------------- */
@Injectable()
export class LocalCidadaoStrategy extends PassportStrategy(LocalStrategy, 'local-cidadao') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'senha' });
  }

  async validate(email: string, senha: string) {
    const user = await this.authService.validateCidadao(email, senha);
    if (!user) throw new UnauthorizedException('Email ou senha inválidos');

    return {
      id: user.id_usuario,
      email: user.email,
      nome: user.pessoa?.nome,
      role: 'cidadao', // ⚠️ role usado pelo RolesGuard
      tipo: 'cidadao',
    };
  }
}

/** -------------------- Local Funcionário -------------------- */
@Injectable()
export class LocalFuncionarioStrategy extends PassportStrategy(LocalStrategy, 'local-funcionario') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'nip', passwordField: 'senha' });
  }

  async validate(nip: string, senha: string) {
    const user = await this.authService.validateFuncionario(nip, senha);
    if (!user) throw new UnauthorizedException('NIP ou senha inválidos');

    return {
      id: user.id_funcionario,
      email: user.email,
      nome: user.pessoa?.nome,
      role: 'monitor', // ⚠️ role usado pelo RolesGuard
      tipo: 'monitor',
    };
  }
}

/** -------------------- JWT Strategy -------------------- */
@Injectable()
export class JwtStrategy extends PassportStrategy(JwtStrategyBase) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SUA_CHAVE_SECRETA',
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      nome: payload.nome,
      role: payload.role, // ⚠️ garante compatibilidade com RolesGuard
      tipo: payload.tipo,
    };
  }
}
