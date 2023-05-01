// src/scene/scene.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scene } from './scene.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scene])],
  providers: [],
  exports: [TypeOrmModule],
})
export class SceneModule {}
