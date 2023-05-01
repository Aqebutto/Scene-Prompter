import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import axios from 'axios';

interface Scene {
  id: number;
  time: number;
  original_text: string;
  prompt: string;
  img?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SceneService {
  private readonly apiUrl = './assets/scenes.json';

  constructor() {}

  getScenes(): Observable<Scene[]> {
    const scenes = localStorage.getItem('scenes');
    if (scenes) {
      return new Observable<Scene[]>((subscriber) => {
        subscriber.next(JSON.parse(scenes));
        subscriber.complete();
      });
    } else {
      return from(axios.get<Scene[]>(this.apiUrl)).pipe(
        map((response) => response.data),
        tap((scenes) => localStorage.setItem('scenes', JSON.stringify(scenes)))
      );
    }
  }
}
