import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CorsProxyService {
  private proxyUrl = 'http://localhost:8080/';

  constructor() {}

  fetchImage(imageUrl: string): Promise<Blob> {
    const proxyImageUrl = `${this.proxyUrl}${imageUrl}`;
    return fetch(proxyImageUrl)
      .then((response) => response.blob())
      .catch((error) => {
        console.error('Failed to fetch image:', error);
        throw error;
      });
  }
}
