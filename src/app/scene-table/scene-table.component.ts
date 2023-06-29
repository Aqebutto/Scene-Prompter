import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import axios from 'axios';
import { map, switchMap } from 'rxjs/operators';

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
  API_KEY = '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';
  apiUrl = 'assets/scenes.json';
  editableSceneId: number | null = null;
  editableScene: Partial<Scene> = {};
  updatedScene: Partial<Scene> = {};
  newScene: Partial<Scene> = {};
  pasteScenes: string = '';
  generatedText: string = '';

  constructor(private http: HttpClient) {
    this.scenes$ = this.http.get<Scene[]>('./assets/scenes.json');
    // sub to scenes$ and log them
  }

  ngOnInit(): void {
    // this.getScenes();
    this.scenes$.subscribe((data) => {
      console.log(data);
      if (data.length > 0) {
        this.makeApiRequest(data[0].original_text).then(
          (generatedText: any) => {
            this.generatedText = generatedText;
            console.log(generatedText);
          }
        );
      }
    });
    this.scenes$ = this.http.get<Scene[]>('./assets/scenes.json');

    // Function to calculate the average length of 'original_text'
    const averageOriginalTextLength$ = this.scenes$.pipe(
      map((scenes: any) => {
        let totalLength = 0;
        scenes.forEach(
          (scene: any) => (totalLength += scene.original_text.length)
        );
        return totalLength / scenes.length;
      })
    );

    // Function to filter the scenes whose 'original_text' length is above average
    const getAboveAverageScenes = (multiplier: number) => {
      return averageOriginalTextLength$.pipe(
        switchMap((averageLength: any) =>
          this.scenes$.pipe(
            map((scenes) =>
              scenes.filter(
                (scene) =>
                  scene.original_text.length > averageLength * multiplier
              )
            )
          )
        )
      );
    };

    // Usage
    getAboveAverageScenes(1.2).subscribe((scenes) => {
      console.log(scenes); // Logs all scenes where 'original_text' length is 20% above average
    });
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

  generatePrompt(): void {
    // Read the contents of the data.txt file
    this.http
      .get('assets/data.txt', { responseType: 'text' })
      .subscribe((data: string) => {
        // Split the file into scenes
        const sceneEntries = data.split('====');

        // Prepare an array to store the generated prompts
        const generatedPrompts: string[] = [];

        // Loop through the scene entries and make API requests for each scene
        sceneEntries.forEach((sceneEntry) => {
          // Extract the time, original text, and prompt
          const timeMatch = sceneEntry.match(/Time: (\d+):/);
          const originalTextMatch = sceneEntry.match(
            /Find a subject\(s\) and activity in this text:\n([\s\S]+?)\nNow use that subject\(s\) and activity to make a prompt/
          );

          if (timeMatch && originalTextMatch) {
            const time = parseInt(timeMatch[1], 10);
            const originalText = originalTextMatch[1].trim();

            // Prepare the prompt for the API request
            const apiPrompt = `${time}: A detailed image of ${originalText}, --cam`;

            // Make the API request to the OpenAI Davinci API
            this.makeApiRequest(apiPrompt).then((generatedText) => {
              // Store the generated prompt
              generatedPrompts.push(generatedText);

              // If all scenes have been processed, log the generated prompts
              if (generatedPrompts.length === sceneEntries.length) {
                console.log(generatedPrompts);
                // Further processing with the generated prompts can be done here
              }
            });
          }
        });
      });
  }
  generateText(): void {
    const data = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            '[time] A detailed image of [subject] [doing something interesting] during [time of day], --cam',
        },
        {
          role: 'user',
          content:
            "Find a subject(s) and activity in this text:\nThe unity of the Grecian Empire endured little longer than Alexander's lifetime.",
        },
      ],
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.API_KEY}`,
    };

    axios
      .post('https://api.openai.com/v1/chat/completions', data, { headers })
      .then((response) => {
        const generatedText = response.data.choices[0].message.content;
        console.log(generatedText);
        // Further processing with the generated text can be done here
      })
      .catch((error) => {
        console.error(error);
      });
  }
  copyPrompt(prompt: string): void {
    navigator.clipboard
      .writeText(prompt)
      .then(() => {
        console.log('Prompt copied to clipboard');
        // You can optionally show a success message or perform additional actions
      })
      .catch((error) => {
        console.error('Failed to copy prompt to clipboard:', error);
        // You can handle the error and display an error message if needed
      });
  }

  // generatePrompt(): void {
  //   this.http.get<Scene[]>('./assets/scenes.json').subscribe((scenes) => {
  //     const generatedPrompts: string[] = [];

  //     scenes.forEach((scene) => {
  //       const apiPrompt = `${scene.time}: A detailed image of ${scene.original_text}, --cam`;
  //       this.makeApiRequest(apiPrompt).then((generatedText) => {
  //         generatedPrompts.push(generatedText);
  //         if (generatedPrompts.length === scenes.length) {
  //           console.log(generatedPrompts);
  //           // Further processing with the generated prompts can be done here
  //         }
  //       });
  //     });
  //   });
  // }

  makeApiRequest(prompt: string): Promise<string> {
    const apiKey = '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';
    const apiUrl =
      'https://api.openai.com/v1/engines/davinci-codex/completions';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };
    const data = {
      prompt,
      max_tokens: 512,
      n: 1,
      temperature: 0.5,
    };

    return this.http
      .post(apiUrl, data, { headers })
      .toPromise()
      .then((response: any) => {
        return response.choices[0].text;
      })
      .catch((error: any) => {
        console.error(error);
        return '';
      });
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
