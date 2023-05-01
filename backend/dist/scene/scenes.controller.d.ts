import { ScenesService } from './scenes.service';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { Scene } from './scene.entity';
export declare class ScenesController {
    private readonly scenesService;
    constructor(scenesService: ScenesService);
    findAll(): Promise<Scene[]>;
    create(createSceneDto: CreateSceneDto): Promise<Scene>;
    update(id: string, updateSceneDto: UpdateSceneDto): Promise<Scene>;
    remove(id: string): Promise<void>;
}
