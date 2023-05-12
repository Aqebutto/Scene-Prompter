import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Scene {
  id?: number;
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
  scenes$: Observable<Scene[]> = new Observable<Scene[]>();

  apiUrl = 'assets/scenes.json';
  editableSceneId: number | null = null;
  editableScene: Partial<Scene> = {};
  updatedScene: Partial<Scene> = {};
  newScene: Partial<Scene> = {};
  pasteScenes: string = '';
  generatedText: string = '';

  constructor(private http: HttpClient) {
    // this.scenes$ = this.http.get<Scene[]>('./assets/scenes.json');
    // sub to scenes$ and log them
  }

  ngOnInit(): void {
    this.getScenes();
    this.scenes$.subscribe((data) => {
      console.log(data);
    });
    // this.scenes$ = this.http.get<Scene[]>('./assets/scenes.json');
  }

  getScenes() {
    const fileUrl = 'assets/data.txt';

    this.http.get(fileUrl, { responseType: 'text' }).subscribe((data) => {
      const scenes: Scene[] = [];

      const lines = data.split('====');
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          const timeMatch = trimmedLine.match(/Time: (\d+):/);
          const originalTextMatch = trimmedLine.match(
            /Find a subject\(s\) and activity in this text:\n(.+)/s
          );
          const promptMatch = trimmedLine.match(
            /Now use that subject\(s\) and activity to make a prompt\n(.+)/s
          );

          if (timeMatch && originalTextMatch && promptMatch) {
            const time = parseInt(timeMatch[1], 10);
            const originalText = originalTextMatch[1].trim();
            const prompt = promptMatch[1].trim();

            scenes.push({
              time,
              original_text: originalText,
              prompt,
            });
          }
        }
      }

      this.scenes$ = new Observable<Scene[]>((subscriber) => {
        subscriber.next(scenes);
        subscriber.complete();
      });
    });
  }

  getScenesFromJSON() {
    this.http.get<Scene[]>('./assets/scenes.json').subscribe((data) => {
      console.log(data);
    });
  }

  generatePrompt() {
    const scriptText = '';
    // this.sceneService.generateText(scriptText).then((generatedText) => {
    //   console.log(generatedText);
    // });
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

    // this.scenes.push(...newScenes);
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
    // this.scenes.push(newScene);
    this.newScene = {};
    this.saveScenes();
  }

  updateScene(id: number, scene: Partial<Scene>) {
    // const index = this.scenes.findIndex((s) => s.id === id);
    // this.scenes[index] = {
    //   ...this.scenes[index],
    //   ...scene,
    // };
    this.saveScenes();
  }

  deleteScene(id: number) {
    // this.scenes = this.scenes.filter((scene) => scene.id !== id);
    this.saveScenes();
  }

  private saveScenes() {
    // localStorage.setItem('scenes', JSON.stringify(this.scenes));
  }

  editScene(scene: Scene) {
    //this.editableSceneId = scene.id;
    this.editableScene = { ...scene };
    this.saveScenes();
  }
  cancelEdit(): void {
    this.editableSceneId = null;
  }
}
