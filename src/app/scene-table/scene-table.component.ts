import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
// import axios from 'axios';
import { map, switchMap } from 'rxjs/operators';
import { OpenaiService } from '../openai.service';
import { firstValueFrom } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
import { CorsProxyService } from '../cors-proxy.service';
import { ApiService } from '../api.service';

interface Scene {
  id?: number;
  time: number;
  original_text?: string;
  prompt: string;
  gptPrompt?: string;
  length?: number;
  imageUrl?: string;
  similarity_score?: number;
  best_match_file?: string;
  selected?: true;
}
interface DalleResponse {
  generatedText: string;
}

@Component({
  selector: 'app-scene-table',
  templateUrl: './scene-table.component.html',
  styleUrls: ['./scene-table.component.scss'],
})
export class SceneTableComponent implements OnInit {
  // clicked = false;
  selectedScenes: Scene[] = [];
  countdown: number = 60;
  countdownInterval: any;
  leoCountdownInterval: any;
  leoCountdown: number = 30;
  loading = false;
  doAllImages = false;
  scenes$ = new BehaviorSubject<Scene[]>([]);
  scenesObservable$ = this.scenes$.asObservable();

  API_KEY = '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';
  apiUrl = 'assets/scenes_target.json';
  editableSceneId: number | null = null;
  editableScene: Partial<Scene> = {};
  updatedScene: Partial<Scene> = {};
  newScene: Partial<Scene> = {};
  pasteScenes: string = '';
  generatedText: string = '';
  picsLengthArray: number[] = [];

  constructor(
    private http: HttpClient,
    private openaiService: OpenaiService,
    private corsProxyService: CorsProxyService,
    private apiService: ApiService
  ) {
    // const x =
    //   '(((Sacred Act of Creation))) A photorealistic depiction of the Almighty engaging with an inferior in the sacred act of creation, as described in "Let us make man in our image." The image should be highly detailed and realistic, resembling a photograph taken with a 70mm lens. The lighting should be soft and divine, with a celestial glow illuminating the scene. The background should be ethereal and heavenly, conveying a sense of reverence and divine collaboration.';
    // const y =
    //   '(((Divine Collaboration))) An artistic interpretation of the Almighty inviting an inferior to participate in the sacred act of creation with the phrase "Let us make man in our image." The image should be created in a Renaissance art style, inspired by the works of Michelangelo and Raphael. It should feature a majestic and harmonious composition with the Almighty and the inferior depicted in a grand manner. The camera angle should be slightly high, capturing the scene from a heavenly perspective. The lighting should be reminiscent of classic Renaissance paintings, with soft, golden hues and subtle chiaroscuro.';
    // const z =
    //   '(((Creation Collaboration Realistic Photography))) A realistic photographic representation of the Almighty engaging an inferior in the sacred act of creation, using the phrase "Let us make man in our image." The image should resemble a high-resolution photograph captured with a 50mm lens. The lighting should emulate the warm and inviting glow of a sacred space, creating a sense of awe and collaboration. The scene should be set in an indoor environment, perhaps a church or a temple, symbolizing the divine connection between the Almighty and the inferior.';
    // this.generateLeoImg(x, y, z);
    // this.scenes$ = this.http.get<Scene[]>('./assets/scenes.json');
    // sub to scenes$ and log them
  }

  ngOnInit(): void {
    // this.getScenes();
    const totalLength = 0;
    const loadedScenes = this.loadScenesFromLocalStorage();
    console.log('Got scenes from json');
    this.http
      .get<Scene[]>('./assets/scenes.json')
      .subscribe((data: Scene[]) => {
        this.scenes$.next(data);
      });
    // if (loadedScenes) {
    //   this.scenes$.next(loadedScenes); // Update the BehaviorSubject with the scenes from local storage
    // } else {
    //   // If there are no scenes in local storage, fetch from the JSON file

    // }
    this.scenes$.subscribe((data: Scene[]) => {
      let totalLength = 0;

      //   if (scene.original_text) {
      //     scene.length = scene.original_text.length * 0.066;
      //     // generate all gpt Prompts
      //     // this.generateGptPrompt(scene);

      //     if (!scene.gptPrompt || scene.gptPrompt.trim().length === 0) {
      //       // this.generateGptPrompt(scene);
      //     }

      //     this.picsLengthArray.push(scene.original_text.length * 0.066);
      //     totalLength += scene.original_text.length;
      //   }
      // });
      console.log(this.picsLengthArray);
      let averageLength = totalLength / data.length;
      console.log(
        `Average length of a scene read by Charles II: ${0.066 * averageLength}`
      );
      console.log(
        `Average length of a scene read by Sarag: ${0.06006 * averageLength}`
      );
      this.saveScenesToLocalStorage(data);
    });
    // this.scenes$ = this.http.get<Scene[]>('./assets/scenes.json');

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
              scenes.filter((scene) => {
                if (scene.original_text) {
                  scene.original_text.length > averageLength * multiplier;
                }
              })
            )
          )
        )
      );
    };

    // Usage
    getAboveAverageScenes(1.2).subscribe((scenes) => {
      // console.log(scenes); // Logs all scenes where 'original_text' length is 20% above average
    });
    // this.openaiService
    //   .getDalleResponse(
    //     'A watercolor painting portraying a vision of the Son of Man, coming with the clouds of heaven. He approaches the Ancient of Days, and they meet in a celestial realm filled with radiant light and ethereal beauty. Painted with: Soft watercolor blends, emphasizing the dreamlike and divine nature of the encounter.'
    //   )
    //   .subscribe((res) => {
    //     console.log(res);
    //   });
  }

  generateGptPrompt(scene: Scene): void {
    if (scene.original_text)
      this.openaiService
        .getGPTResponseTwo(scene.original_text)
        .subscribe((gptPrompt: string) => {
          scene.gptPrompt = gptPrompt;
          console.log(gptPrompt);

          firstValueFrom(this.scenes$).then((scenes: Scene[]) => {
            this.saveScenes(scenes);
          });
        });
  }
  async generateAllDalle3Images(scenes: Scene[]): Promise<void> {
    let callCount = 0;
    console.log('processScenes started - callCount: ', callCount);

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      if (scene.time) {
        await this.generateGptImage(scene);
        callCount++;

        await new Promise((resolve) => setTimeout(resolve, 3000));

        if (callCount % 5 === 0 && i < scenes.length - 1) {
          console.log(`Made 5 calls, taking a 61-second break`);
          await new Promise((resolve) => setTimeout(resolve, 61000));
        }
      }
    }

    console.log('processScenes ended - callCount: ', callCount);
  }

  generateGptImage(scene: Scene): void {
    this.openaiService
      .generateImage(scene.prompt, 1, scene.time)
      .subscribe((urls) => {
        // Update the scene with the image URL
        console.log('dalle3 urls: ', urls);
        scene.imageUrl = urls[0]; // Since we're only generating one image

        // Update the BehaviorSubject with the new scene data
        const updatedScenes = this.scenes$.getValue().map((sc) => {
          console.log(sc.imageUrl);
          if (sc === scene) {
            // Find the scene to update (you could also match by an ID if available)
            return { ...sc, imageUrl: scene.imageUrl };
          }
          return sc;
        });

        this.scenes$.next(updatedScenes); // Emit the updated scenes
      });
  }
  generateImagesForScenes(): void {
    // Iterate over the scenes and call generateGptImage for each scene
    for (const scene of this.selectedScenes) {
      this.generateGptImage(scene);
    }
  }
  updateSelectedScenes(): void {
    this.selectedScenes = this.scenes$
      .getValue()
      .filter((scene) => scene.selected);
  }

  makeLeoAiImage(scene: Scene) {
    const promptText = scene.prompt;
    this.apiService.createGeneration(promptText).subscribe(
      (response) => {
        console.log(response);
        // Handle the API response here
      },
      (error) => {
        console.error('An error occurred:', error);
        // Handle the API error here
      }
    );
  }
  makeAllLeoImages(scenes: Scene[]) {
    // Loop through the scenes and call the function for selected times
    for (const scene of scenes) {
      this.makeLeoAiImage(scene);
    }
  }

  generateLeoImg(photorealistic: string, artistic: string, realistic: string) {
    this.apiService.createGeneration(photorealistic).subscribe(
      (response) => {
        console.log(response);
        // Handle the API response here
      },
      (error) => {
        console.error('An error occurred:', error);
        // Handle the API error here
      }
    );
    this.apiService.createGeneration(artistic).subscribe(
      (response) => {
        console.log(response);
        // Handle the API response here
      },
      (error) => {
        console.error('An error occurred:', error);
        // Handle the API error here
      }
    );
    this.apiService.createGeneration(realistic).subscribe(
      (response) => {
        console.log(response);
        // Handle the API response here
      },
      (error) => {
        console.error('An error occurred:', error);
        // Handle the API error here
      }
    );
  }

  // 61 sec time out
  // generateGptImage(scene: Scene): void {
  //   // Simulate a 61-second loading time
  //   setTimeout(() => {
  //     this.openaiService.generateImage(scene.prompt, 1).subscribe((urls) => {
  //       // Update the scene with the image URL
  //       scene.imageUrl = urls[0]; // Since we're only generating one image

  //       // Update the BehaviorSubject with the new scene data
  //       const updatedScenes = this.scenes$.getValue().map((sc) => {
  //         console.log(sc.imageUrl);
  //         if (sc === scene) {
  //           // Find the scene to update (you could also match by an ID if available)
  //           return { ...sc, imageUrl: scene.imageUrl };
  //         }
  //         return sc;
  //       });

  //       this.scenes$.next(updatedScenes); // Emit the updated scenes
  //     });
  //   }, 61000); // 61 seconds in milliseconds
  // }

  // generateGptImage(scene: Scene): void {
  //   this.openaiService.generateImage(scene.prompt, 1).subscribe((urls) => {
  //     const imageUrl = urls[0]; // Since we're only generating one image

  //     // Fetch the image through the proxy server
  //     this.corsProxyService
  //       .fetchImage(imageUrl)
  //       .then((blob) => {
  //         // Handle the blob or create a download link as needed
  //         const url = URL.createObjectURL(blob);

  //         // Update the scene with the proxy image URL
  //         scene.imageUrl = url;

  //         // Update the BehaviorSubject with the new scene data
  //         const updatedScenes = this.scenes$.getValue().map((sc) => {
  //           if (sc === scene) {
  //             // Find the scene to update (you could also match by an ID if available)
  //             return { ...sc, imageUrl: scene.imageUrl };
  //           }
  //           return sc;
  //         });

  //         this.scenes$.next(updatedScenes); // Emit the updated scenes
  //       })
  //       .catch((error) => {
  //         console.error('Failed to fetch image:', error);
  //         // Handle errors if necessary
  //       });
  //   });
  // }

  private updateScenes(scenes: Scene[]): void {
    // Assuming you have a BehaviorSubject for scenes$
    this.scenes$.next([...scenes]);
  }

  saveScenes(scenes: Scene[]): void {
    // const blob = new Blob([JSON.stringify(scenes, null, 2)], {
    //   type: 'application/json',
    // });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'scenes.json';
    // a.click();
    // URL.revokeObjectURL(url);

    localStorage.setItem('scenes', JSON.stringify(scenes));
  }

  saveScenesToFile(scenes: Scene[]): void {
    const blob = new Blob([JSON.stringify(scenes, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scenes.json';
    a.click();
    URL.revokeObjectURL(url);
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

  // getScenes() {
  //   const fileUrl = 'assets/data.txt';

  //   this.http.get(fileUrl, { responseType: 'text' }).subscribe((data) => {
  //     const scenes: Scene[] = [];

  //     const lines = data.split('====');
  //     for (const line of lines) {
  //       const trimmedLine = line.trim();
  //       if (trimmedLine) {
  //         const timeMatch = trimmedLine.match(/Time: (\d+):/);
  //         const originalTextMatch = trimmedLine.match(
  //           /Find a subject\(s\) and activity in this text:\n(.+)/s
  //         );
  //         const promptMatch = trimmedLine.match(
  //           /Now use that subject\(s\) and activity to make a prompt\n(.+)/s
  //         );

  //         if (timeMatch && originalTextMatch && promptMatch) {
  //           const time = parseInt(timeMatch[1], 10);
  //           const originalText = originalTextMatch[1].trim();
  //           const prompt = promptMatch[1].trim();

  //           scenes.push({
  //             time,
  //             original_text: originalText,
  //             prompt,
  //           });
  //         }
  //       }
  //     }

  //     this.scenes$ = new Observable<Scene[]>((subscriber) => {
  //       subscriber.next(scenes);
  //       subscriber.complete();
  //     });
  //   });
  // }

  getScenesFromJSON() {
    this.http.get<Scene[]>('./assets/scenes.json').subscribe((data) => {
      console.log(data);
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
    // this.saveScenes();
  }

  createScene(scene: Partial<Scene>) {
    const timestamp = new Date().getTime();
    const newScene: Scene = {
      id: timestamp,
      time: scene.time || 0,
      original_text: scene.original_text || '',
      prompt: scene.prompt || '',
    };
    this.newScene = {};
  }

  updateScene(id: number, scene: Partial<Scene>) {
    firstValueFrom(this.scenes$).then((scenes: Scene[]) => {
      const index = scenes.findIndex((s) => s.id === id);
      scenes[index] = {
        ...scenes[index],
        ...scene,
      };
      this.saveScenes(scenes);
    });
  }
  // In your SceneTableComponent

  onSaveClick(): void {
    // firstValueFrom(this.scenes$).then((scenes) => this.saveScenes(scenes));
  }

  saveScenesToLocalStorage(scenes: Scene[]): void {
    localStorage.setItem('scenes', JSON.stringify(scenes));
  }

  loadScenesFromLocalStorage(): Scene[] | null {
    const scenesString = localStorage.getItem('scenes');
    if (scenesString) {
      return JSON.parse(scenesString);
    }
    return null;
  }

  cancelEdit(): void {
    this.editableSceneId = null;
  }
  printScenesToConsole() {
    this.scenes$.subscribe((scenes) => {
      console.log('Scenes:');
      scenes.forEach((scene, index) => {
        console.log(`Scene ${index + 1}:`);
        console.log('Prompt:', scene.prompt);
        console.log('Image URL:', scene.imageUrl);
        // Add more properties as needed
      });
    });
  }

  downloadImage(imageUrl: string, fileName: string): void {
    // Create a request to fetch the image
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a Blob object from the response
        const blobUrl = URL.createObjectURL(blob);

        // Create an anchor element to trigger the download
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = fileName;

        // Programmatically trigger the click event on the anchor element
        anchor.click();

        // Clean up the temporary URL
        URL.revokeObjectURL(blobUrl);
      });
  }
}
