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
exports.ScenesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const scene_entity_1 = require("./scene.entity");
let ScenesService = class ScenesService {
    constructor(scenesRepository) {
        this.scenesRepository = scenesRepository;
    }
    async create(scene) {
        const newScene = this.scenesRepository.create(scene);
        return this.scenesRepository.save(newScene);
    }
    async findOne(id) {
        return this.scenesRepository.findOne(id);
    }
    async update(id, scene) {
        await this.scenesRepository.update(id, scene);
        return this.scenesRepository.findOne(id);
    }
    async remove(id) {
        await this.scenesRepository.delete(id);
    }
    async findAll() {
        return this.scenesRepository.find();
    }
};
ScenesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(scene_entity_1.Scene)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ScenesService);
exports.ScenesService = ScenesService;
//# sourceMappingURL=scenes.service.js.map