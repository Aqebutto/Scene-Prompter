// import { Injectable } from '@angular/core';
// import { Observable, from, tap, map } from 'rxjs';
// import axios from 'axios';

// interface Scene {
//   id: number;
//   time: number;
//   original_text: string;
//   prompt: string;
//   img?: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class SceneService {
//   private readonly apiUrl = './assets/scenes.json';

//   constructor() {}

//   generateText(scriptText: string): Promise<string> {
//     const API_KEY = 'your_api_key_here';
//     const prompt =
//       '[time] A detailed image of [subject] [doing something interesting] during [time of day], taken with a [type of camera], using [type of lens] with cinematic lighting --v 5 --ar 16:9';
//     const data = {
//       prompt: prompt + '\n\n' + scriptText,
//       max_tokens: 512,
//       n: 1,
//       temperature: 0.5,
//     };
//     const headers = {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${API_KEY}`,
//     };
//     return axios
//       .post(
//         'https://api.openai.com/v1/engine/davinci-codex/completions',
//         data,
//         { headers }
//       )
//       .then((response) => {
//         return response.data.choices[0].text;
//       })
//       .catch((error) => {
//         console.error(error);
//         return '';
//       });
//   }

// }
