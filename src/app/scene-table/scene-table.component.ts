import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Scene {
  id: number;
  time: number;
  original_text: string;
  prompt: string;
  img?: string;
}

@Component({
  selector: 'app-scene-table',
  templateUrl: './scene-table.component.html',
  styleUrls: ['./scene-table.component.scss'],
})
export class SceneTableComponent implements OnInit {
  scenes: Scene[] = [];
  apiUrl = 'assets/scenes.json';
  editableSceneId: number | null = null;
  editableScene: Partial<Scene> = {};
  updatedScene: Partial<Scene> = {};
  newScene: Partial<Scene> = {};
  pasteScenes: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getScenes();
  }

  getScenes() {
    const scenes = localStorage.getItem('scenes');
    if (scenes) {
      this.scenes = JSON.parse(scenes);
      console.log(this.scenes);
    } else {
      this.http.get<Scene[]>(this.apiUrl).subscribe((scenes) => {
        this.scenes = scenes;
        localStorage.setItem('scenes', JSON.stringify(this.scenes));
      });
    }
  }

  addPastedScenes(pasteText: string) {
    const lines = pasteText.split('\n');
    const newScenes: Scene[] = [];

    let currentScene: Partial<Scene> = {};
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('#')) {
        // Start of a new scene
        if (currentScene.id) {
          // Add the previous scene to the list
          newScenes.push(currentScene as Scene);
        }

        currentScene = {
          id: newScenes.length + 1,
        };
        currentScene.original_text = trimmedLine.substring(1).trim();
      } else {
        // Property line
        const [name, value] = trimmedLine.split(':').map((s) => s.trim());
        switch (name.toLowerCase()) {
          case 'time':
            currentScene.time = parseInt(value, 10);
            break;
          case 'prompt':
            currentScene.prompt = value;
            break;
          default:
            console.warn(`Unknown property "${name}"`);
        }
      }
    }

    // Add the last scene to the list
    if (currentScene.id) {
      newScenes.push(currentScene as Scene);
    }

    this.scenes.push(...newScenes);
    this.saveScenes();
  }

  createScene(scene: Partial<Scene>) {
    const timestamp = new Date().getTime();
    const newScene: Scene = {
      id: timestamp,
      time: scene.time || 0,
      original_text: scene.original_text || '',
      prompt: scene.prompt || '',
    };
    this.scenes.push(newScene);
    this.newScene = {};
    this.saveScenes();
  }

  updateScene(id: number, scene: Partial<Scene>) {
    const index = this.scenes.findIndex((s) => s.id === id);
    this.scenes[index] = {
      ...this.scenes[index],
      ...scene,
    };
    this.saveScenes();
  }

  deleteScene(id: number) {
    this.scenes = this.scenes.filter((scene) => scene.id !== id);
    this.saveScenes();
  }

  private saveScenes() {
    localStorage.setItem('scenes', JSON.stringify(this.scenes));
  }

  editScene(scene: Scene) {
    this.editableSceneId = scene.id;
    this.editableScene = { ...scene };
    this.saveScenes();
  }
  cancelEdit(): void {
    this.editableSceneId = null;
  }
}
