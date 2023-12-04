import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://cloud.leonardo.ai/api/rest/v1/generations'; // Replace with your API endpoint URL
  private apiKey = ''; // Replace with your actual API key

  constructor(private http: HttpClient) {}

  createGeneration(prompt: string): Observable<any> {
    const payload = {
      height: 656,
      prompt: prompt + ' high-detailed, ultra-realistic.',
      width: 1176,
      alchemy: true,
      // modelId: '1e60896f-3c26-4296-8ecc-53e2afecc132',
      // standart xl
      // modelId: '5c232a9e-9061-4777-980a-ddc8e65647c6',
      //  vision xl
      // AlbedoBase XL
      modelId: '2067ae52-33fd-4a82-bb92-c2c55e7d2786',
      highResolution: true,
      num_images: 1,
      photoRealStrength: 0.45,
      presetStyle: 'DYNAMIC',
      negative_prompt:
        '(((2 heads))), duplicate, blurry, abstract, disfigured, deformed, cartoon, animated, toy, figure, framed, 3d, cartoon, 3d, disfigured, bad art, deformed, poorly drawn, extra limbs, close up, b&w, weird colors, blurry, watermark, blur haze, 2 heads, long neck, watermark, elongated body, cropped image, out of frame,draft,deformed hands, twisted fingers, double image, malformed hands, multiple heads, extra limb, ugly, poorly drawn hands, missing limb, cut-off, over-saturated, grain, lowères, bad anatomy, poorly drawn face, mutation, mutated, floating limbs, disconnected limbs, out of focus, long body, disgusting, extra fingers, gross proportions, missing arms, (((mutated hands))),(((bad fingers))) cloned face, missing legs',
    };

    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    return this.http.post(this.apiUrl, payload, { headers });
  }
}
