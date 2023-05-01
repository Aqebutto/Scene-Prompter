import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ScenesService } from './scenes.service';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { Scene } from './scene.entity';

@Controller('scenes')
export class ScenesController {
  constructor(private readonly scenesService: ScenesService) {}

  @Get()
  findAll(): Promise<Scene[]> {
    return this.scenesService.findAll();
  }

  @Post()
  create(@Body() createSceneDto: CreateSceneDto): Promise<Scene> {
    return this.scenesService.create(createSceneDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSceneDto: UpdateSceneDto,
  ): Promise<Scene> {
    return this.scenesService.update(id, updateSceneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.scenesService.remove(id);
  }
}
