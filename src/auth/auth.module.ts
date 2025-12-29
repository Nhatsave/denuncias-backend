import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Pessoa, Usuario, Funcionario } from './entities/geral.entity';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from 'src/users/users.module'; 
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, LocalCidadaoStrategy, LocalFuncionarioStrategy } from './strategies';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pessoa, Funcionario, Usuario]),
    PassportModule,
    JwtModule.register({
      global: true, // 🔹 disponibiliza JwtService para todos os módulos
      secret: process.env.JWT_SECRET || 'SUA_CHAVE_SECRETA',
      signOptions: { expiresIn: '8h' },
    }),
    forwardRef(() => UsersModule), // somente se houver circular dependency
  ],
  

  controllers: [AuthController],
  providers: [ AuthService,
    LocalCidadaoStrategy,
    LocalFuncionarioStrategy, JwtStrategy],
  exports: [AuthService, JwtModule], // Exporte JwtModule se necessário
})
export class AuthModule {}
