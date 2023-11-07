import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Scene } from './scene.model'; // Replace with your actual path to the Scene model

@Injectable({
  providedIn: 'root',
})
export class FirebaseScenesService {
  currentScenesName = 'godhead-e1-scenes';
  constructor(private firestore: AngularFirestore) {}

  addScene(scene: Scene) {
    return this.firestore.collection(this.currentScenesName).add(scene);
  }

  updateScene(sceneId: string, scene: Partial<Scene>) {
    return this.firestore
      .doc(`${this.currentScenesName}/${sceneId}`)
      .update(scene);
  }

  deleteScene(sceneId: string) {
    return this.firestore.doc(`${this.currentScenesName}/${sceneId}`).delete();
  }

  getSceneById(sceneId: string) {
    return this.firestore
      .doc<Scene>(`${this.currentScenesName}/${sceneId}`)
      .valueChanges();
  }

  getAllScenes() {
    return this.firestore
      .collection<Scene>(this.currentScenesName)
      .valueChanges({ idField: 'id' });
  }
}
