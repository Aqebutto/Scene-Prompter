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
exports.ScenesController = void 0;
const common_1 = require("@nestjs/common");
const scenes_service_1 = require("./scenes.service");
const create_scene_dto_1 = require("./dto/create-scene.dto");
const update_scene_dto_1 = require("./dto/update-scene.dto");
let ScenesController = class ScenesController {
    constructor(scenesService) {
        this.scenesService = scenesService;
    }
    findAll() {
        return this.scenesService.findAll();
    }
    create(createSceneDto) {
        return this.scenesService.create(createSceneDto);
    }
    update(id, updateSceneDto) {
        return this.scenesService.update(id, updateSceneDto);
    }
    remove(id) {
        return this.scenesService.remove(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScenesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_scene_dto_1.CreateSceneDto]),
    __metadata("design:returntype", Promise)
], ScenesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_scene_dto_1.UpdateSceneDto]),
    __metadata("design:returntype", Promise)
], ScenesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScenesController.prototype, "remove", null);
ScenesController = __decorate([
    (0, common_1.Controller)('scenes'),
    __metadata("design:paramtypes", [scenes_service_1.ScenesService])
], ScenesController);
exports.ScenesController = ScenesController;
//# sourceMappingURL=scenes.controller.js.map