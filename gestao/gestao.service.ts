import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veiculo } from './entities/veiculo.entity';
import { Historico } from './entities/historico.entity';

@Injectable()
export class GestaoService {
  constructor(
    @InjectRepository(Veiculo)
    private veiculoRepo: Repository<Veiculo>,

    @InjectRepository(Historico)
    private historicoRepo: Repository<Historico>,
  ) {}

  // Buscar todos
  findAllVeiculos() {
    return this.veiculoRepo.find();
  }

  // Buscar por ID
  findVeiculoById(id: number) {
    return this.veiculoRepo.findOne({ where: { id } });
  }

  // Criar / actualizar
  saveVeiculo(data: Partial<Veiculo>) {
    return this.veiculoRepo.save(data);
  }

  // Remover
  removeVeiculo(id: number) {
    return this.veiculoRepo.delete(id);
  }

  // Histórico
  getHistorico(veiculoId: number) {
    return this.historicoRepo.find({ where: { veiculoId } });
  }
}
