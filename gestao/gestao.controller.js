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
exports.GestaoController = void 0;
const common_1 = require("@nestjs/common");
const gestao_service_1 = require("./gestao.service");
let GestaoController = class GestaoController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAllVeiculos();
    }
    findOne(id) {
        return this.service.findVeiculoById(+id);
    }
    save(data) {
        return this.service.saveVeiculo(data);
    }
    remove(id) {
        return this.service.removeVeiculo(+id);
    }
    historico(id) {
        return this.service.getHistorico(+id);
    }
};
exports.GestaoController = GestaoController;
__decorate([
    (0, common_1.Get)('veiculos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GestaoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('veiculos/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GestaoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('veiculos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GestaoController.prototype, "save", null);
__decorate([
    (0, common_1.Delete)('veiculos/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GestaoController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('historico/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GestaoController.prototype, "historico", null);
exports.GestaoController = GestaoController = __decorate([
    (0, common_1.Controller)('gestao'),
    __metadata("design:paramtypes", [gestao_service_1.GestaoService])
], GestaoController);
//# sourceMappingURL=gestao.controller.js.map