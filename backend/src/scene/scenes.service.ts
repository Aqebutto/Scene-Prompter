import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scene } from './scene.entity';

@Injectable()
export class ScenesService {
  constructor(
    @InjectRepository(Scene)
    private scenesRepository: Repository<Scene>,
  ) {}

  async create(scene: Partial<Scene>): Promise<Scene> {
    const newScene = this.scenesRepository.create(scene);
    return this.scenesRepository.save(newScene);
  }

  async findOne(id: string): Promise<Scene> {
    return this.scenesRepository.findOne(id as any);
  }

  async update(id: string, scene: Partial<Scene>): Promise<Scene> {
    await this.scenesRepository.update(id, scene);
    return this.scenesRepository.findOne(id as any);
  }

  async remove(id: string): Promise<void> {
    await this.scenesRepository.delete(id);
  }
  async findAll(): Promise<Scene[]> {
    return this.scenesRepository.find();
  }
}
