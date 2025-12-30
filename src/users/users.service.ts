// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Usuario } from '../auth/entities/geral.entity';
import { Denuncia } from '../denuncias/entities/denuncia.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Denuncia)
    private denunciaRepo: Repository<Denuncia>,
  ) {}

  // Busca denúncias APENAS do usuário logado
  async buscarDenunciasDoUsuario(userId: number, pagina: number = 2, limite: number = 100) {
    const skip = (pagina - 1) * limite;

    const cidadao = await this.getMe(userId)
    const id = cidadao.id;
    
    console.log('Cidadao a requisitar: ', id)
    const [denuncias, total] = await this.denunciaRepo.findAndCount({
      where: { id_usuario: id, apagado: Not('Sim')   },
      relations: ['usuario', 'usuario.pessoa'],
      //order: { data_denuncia: 'DESC' },
      skip,
      take: limite,
    });
    
    return {
      denuncias: denuncias.map(d => ({
        id: d.id_denuncia,
        descricao: d.descricao,
        status: d.status,
        data: d.data_denuncia,
        //localizacao: d.localizacao,
      })),
      total,
      pagina,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  // Serviço de denúncias
async marcarComoApagada(userId: number, idDenuncia: number) {
  // Atualiza apenas a denúncia específica, definindo 'apagado' como 'Sim'
  await this.denunciaRepo.update(
    { id_denuncia: idDenuncia }, // filtro
    { apagado: 'Sim' }           // alteração
  );

  // Opcional: retorna a denúncia atualizada
  const denunciaAtualizada = await this.denunciaRepo.findOne({
    where: { id_denuncia: idDenuncia },
    relations: ['usuario', 'usuario.pessoa'],
  });

  return denunciaAtualizada;
}

  // Busca perfil do usuário logado
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



  // Busca denúncias de um usuário específico
/*async buscarDenunciasDoUsuario(
    usuario: Usuario,
    pagina: number,
    limite: number,
  ): Promise<{ results: DenunciaEstadoRespostaDto[]; total: number }> {

    const paginaAtual = pagina > 0 ? pagina : 1;
    const skip = (paginaAtual - 1) * limite;

    // Busca com paginação e relações
    const [results, total] = await this.denunciaRepository.findAndCount({
      where: {
        usuario: { id_usuario: usuario.id_usuario },
      },
      relations: {
        usuario: {
          pessoa: true, // traz informações pessoais do usuário
        },
      },
      take: limite,
      skip,
      order: {
        data_denuncia: 'DESC',
      },
    });

    // Mapeia para o DTO de resposta específico
    const mappedResults: DenunciaEstadoRespostaDto[] = results.map(d => ({
      id_denuncia: d.id_denuncia,
      descricao: d.descricao,
      status: d.status,
      ficheiro: d.anexos,       // array de anexos
      data_criacao: d.data_denuncia, // Date
      localizacao: d.localizacao,
    }));

    return { results: mappedResults, total };
  }*/

/*
    async buscarDenunciasDoUsuario(
  usuario: Usuario,
  pagina: number,
  limite: number,
): Promise<{ results: DenunciaEstadoRespostaDto[]; total: number }> {

  const paginaAtual = pagina > 0 ? pagina : 1;
  const skip = (paginaAtual - 1) * limite;

  const [results, total] = await this.denunciaRepository
    .createQueryBuilder('denuncia')
    .innerJoin('denuncia.usuario', 'usuario')
    .where('usuario.id_usuario = :id', { id: usuario.id_usuario })
    .orderBy('denuncia.data_denuncia', 'DESC')
    .skip(skip)
    .take(limite)
    .getManyAndCount();

  const mappedResults: DenunciaEstadoRespostaDto[] = results.map(d => ({
    id_denuncia: d.id_denuncia,
    descricao: d.descricao,
    status: d.status,
    ficheiro: d.anexos,
    data_criacao: d.data_denuncia,
    localizacao: d.localizacao,
  }));

  return { results: mappedResults, total };
}
*/
  







/*
  async findAll() {
  const data = await this.denunciaRepository.query('SELECT * FROM denuncia');
  console.log(data);
  return data;
  }*/