"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestaoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const veiculo_entity_1 = require("./entities/veiculo.entity");
const historico_entity_1 = require("./entities/historico.entity");
let GestaoService = class GestaoService {
    veiculoRepo;
    historicoRepo;
    constructor(veiculoRepo, historicoRepo) {
        this.veiculoRepo = veiculoRepo;
        this.historicoRepo = historicoRepo;
    }
    findAllVeiculos() {
        return this.veiculoRepo.find();
    }
    findVeiculoById(id) {
        return this.veiculoRepo.findOne({ where: { id } });
    }
    saveVeiculo(data) {
        return this.veiculoRepo.save(data);
    }
    removeVeiculo(id) {
        return this.veiculoRepo.delete(id);
    }
    getHistorico(veiculoId) {
        return this.historicoRepo.find({ where: { veiculoId } });
    }
};
exports.GestaoService = GestaoService;
exports.GestaoService = GestaoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(veiculo_entity_1.Veiculo)),
    __param(1, (0, typeorm_1.InjectRepository)(historico_entity_1.Historico)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], GestaoService);
//# sourceMappingURL=gestao.service.js.map