import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/auth/entities/geral.entity';
import { Repository } from 'typeorm';
 

@Injectable()
export class Servicos {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

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
}
