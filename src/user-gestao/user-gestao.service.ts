// src/user-gestao/user-gestao.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Denuncia } from "../denuncias/entities/denuncia.entity";
import { Usuario } from "../auth/entities/geral.entity";

@Injectable()
export class UserGestaoService {
  constructor(
    @InjectRepository(Denuncia)
    private readonly denunciaRepository: Repository<Denuncia>,
    
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Método para buscar TODAS as denúncias (gestão)
  async findAllDenuncias() {
    return await this.denunciaRepository.find({
      relations: ['usuario', 'usuario.pessoa'], // Inclui usuário e pessoa
      order: {
        //data_criacao: 'DESC',
      },
      select: {
        id_denuncia: true,
       // titulo: true,
        descricao: true,
       // localizacao: true,
      //  categoria: true,
        anexos: true,
        status: true,
       // data_criacao: true,
       /* usuario: {
          id_usuario: true,
          email: true,
          pessoa: {
            nome: true,
            contacto: true,
          }
        },*/
      },
    });
  }

  // Método para buscar denúncias PENDENTES (gestão)
  async findDenunciasPendentes() {
    return await this.denunciaRepository.find({
      where: { status: 'pendente' },
      relations: ['usuario', 'usuario.pessoa'],
      //order: { data_criacao: 'DESC' },
      select: {
        id_denuncia: true,
       // titulo: true,
        descricao: true,
      //  localizacao: true,
      //  categoria: true,
        anexos: true,
        status: true,
      //  data_criacao: true,
        /*usuario: {
          id_usuario: true,
          email: true,
          pessoa: {
            nome: true,
            contacto: true,
          }
        },*/
      },
    });
  }
/*
   async findAllDenuncias() {
    return await this.dataSource
      .getRepository('Denuncia') // ← Nome da entidade como string
      .createQueryBuilder('denuncia')
      .leftJoinAndSelect('denuncia.usuario', 'usuario')
      .leftJoinAndSelect('usuario.pessoa', 'pessoa')
      .orderBy('denuncia.data_criacao', 'DESC')
      .getMany();
  }

  async findDenunciasPendentes() {
    return await this.dataSource
      .getRepository('Denuncia')
      .createQueryBuilder('denuncia')
      .leftJoinAndSelect('denuncia.usuario', 'usuario')
      .leftJoinAndSelect('usuario.pessoa', 'pessoa')
      .where('denuncia.status = :status', { status: 'pendente' })
      .orderBy('denuncia.data_criacao', 'DESC')
      .getMany();
  }*/
  

  // Método para buscar denúncias por status
  async findDenunciasByStatus(status: string) {
    const statusValidos = ['pendente', 'em_analise', 'resolvida', 'rejeitada'];
    
    if (!statusValidos.includes(status)) {
      status = 'pendente';
    }
    
    return await this.denunciaRepository.find({
      where: { status },
      relations: ['usuario', 'usuario.pessoa'],
      //order: { data_criacao: 'DESC' },
    });
  }

  // Método para buscar denúncia específica por ID (detalhes completos)
  async findDenunciaById(id: number) {
    return await this.denunciaRepository.findOne({
      where: { id_denuncia: id },
      relations: ['usuario', 'usuario.pessoa'],
      select: {
        id_denuncia: true,
       // titulo: true,
        descricao: true,
       // localizacao: true,
       // categoria: true,
        anexos: true,
        status: true,
      //  data_criacao: true,
        /*usuario: {
          id_usuario: true,
          email: true,
          pessoa: {
            id_pessoa: true,
            nome: true,
            apelido: true,
            contacto: true,
            data_nascimento: true,
            genero: true,
          }
        },*/
      },
    });
  }

  // Método para atualizar status da denúncia (gestão)
  async atualizarStatusDenuncia(id: number, status: string, observacao?: string) {
    const denuncia = await this.denunciaRepository.findOne({
      where: { id_denuncia: id }
    });
    
    if (!denuncia) {
      throw new Error('Denúncia não encontrada');
    }
    
    // Atualiza status
    await this.denunciaRepository.update(id, {
      status,
      // Pode adicionar campos de auditoria
      // data_atualizacao: new Date(),
      // atualizado_por: userId,
      // observacao,
    });
    
    return this.findDenunciaById(id);
  }

  // Método para buscar estatísticas das denúncias
  async getEstatisticasDenuncias() {
    const counts = await this.denunciaRepository
      .createQueryBuilder('denuncia')
      .select('denuncia.status', 'status')
      .addSelect('COUNT(*)', 'total')
      .groupBy('denuncia.status')
      .getRawMany();

    // Total por categoria (exemplo adicional)
    const categorias = await this.denunciaRepository
      .createQueryBuilder('denuncia')
      .select('denuncia.categoria', 'categoria')
      .addSelect('COUNT(*)', 'total')
      .where('denuncia.categoria IS NOT NULL')
      .groupBy('denuncia.categoria')
      .getRawMany();

    return {
      porStatus: counts,
      porCategoria: categorias,
      totalGeral: counts.reduce((sum, item) => sum + parseInt(item.total), 0),
    };
  }

  // Método para buscar denúncias com filtros avançados (gestão)
  async findDenunciasComFiltros(filters: {
    status?: string;
    categoria?: string;
    dataInicio?: Date;
    dataFim?: Date;
    usuarioId?: number;
  }) {
    const query = this.denunciaRepository.createQueryBuilder('denuncia')
      .leftJoinAndSelect('denuncia.usuario', 'usuario')
      .leftJoinAndSelect('usuario.pessoa', 'pessoa')
      .orderBy('denuncia.data_criacao', 'DESC');

    // Aplica filtros
    if (filters.status) {
      query.andWhere('denuncia.status = :status', { status: filters.status });
    }
    
    if (filters.categoria) {
      query.andWhere('denuncia.categoria = :categoria', { categoria: filters.categoria });
    }
    
    if (filters.dataInicio && filters.dataFim) {
      query.andWhere('denuncia.data_criacao BETWEEN :dataInicio AND :dataFim', {
        dataInicio: filters.dataInicio,
        dataFim: filters.dataFim,
      });
    }
    
    if (filters.usuarioId) {
      query.andWhere('denuncia.id_usuario = :usuarioId', { usuarioId: filters.usuarioId });
    }

    return await query.getMany();
  }

  // Método para buscar todos os usuários (denunciantes)
  async findAllUsuarios() {
    return await this.usuarioRepository.find({
      relations: ['pessoa'],
      select: {
        id_usuario: true,
        email: true,
        //data_criacao: true,
        pessoa: {
          id_pessoa: true,
          nome: true,
          apelido: true,
          contacto: true,
          data_nascimento: true,
        }
      },
    });
  }

  // Método para buscar estatísticas dos usuários
  async getEstatisticasUsuarios() {
    const totalUsuarios = await this.usuarioRepository.count();
    
    const usuariosPorMes = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .select('DATE_FORMAT(usuario.data_criacao, "%Y-%m")', 'mes')
      .addSelect('COUNT(*)', 'total')
      .groupBy('mes')
      .orderBy('mes', 'DESC')
      .limit(12)
      .getRawMany();

    return {
      totalUsuarios,
      usuariosPorMes,
    };
  }
}