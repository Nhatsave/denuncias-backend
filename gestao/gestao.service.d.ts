import { Repository } from 'typeorm';
import { Veiculo } from './entities/veiculo.entity';
import { Historico } from './entities/historico.entity';
export declare class GestaoService {
    private veiculoRepo;
    private historicoRepo;
    constructor(veiculoRepo: Repository<Veiculo>, historicoRepo: Repository<Historico>);
    findAllVeiculos(): Promise<Veiculo[]>;
    findVeiculoById(id: number): Promise<Veiculo | null>;
    saveVeiculo(data: Partial<Veiculo>): Promise<Partial<Veiculo> & Veiculo>;
    removeVeiculo(id: number): Promise<import("typeorm").DeleteResult>;
    getHistorico(veiculoId: number): Promise<Historico[]>;
}
