import { GestaoService } from './gestao.service';
export declare class GestaoController {
    private readonly service;
    constructor(service: GestaoService);
    findAll(): Promise<import("./entities/veiculo.entity").Veiculo[]>;
    findOne(id: string): Promise<import("./entities/veiculo.entity").Veiculo | null>;
    save(data: any): Promise<Partial<import("./entities/veiculo.entity").Veiculo> & import("./entities/veiculo.entity").Veiculo>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    historico(id: string): Promise<import("./entities/historico.entity").Historico[]>;
}
