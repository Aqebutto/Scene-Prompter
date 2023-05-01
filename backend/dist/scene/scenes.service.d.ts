import { Repository } from 'typeorm';
import { Scene } from './scene.entity';
export declare class ScenesService {
    private scenesRepository;
    constructor(scenesRepository: Repository<Scene>);
    create(scene: Partial<Scene>): Promise<Scene>;
    findOne(id: string): Promise<Scene>;
    update(id: string, scene: Partial<Scene>): Promise<Scene>;
    remove(id: string): Promise<void>;
    findAll(): Promise<Scene[]>;
}
