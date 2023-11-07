import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
// import { OpenAIApi, Configuration } from 'openai';
interface GptResponse {
  choices: { message: { content: string } }[];
}
@Injectable({
  providedIn: 'root',
})
export class OpenaiService {
  openaiKey = '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';
  // private openai: OpenAIApi; // Declare a private field for the OpenAI API instance

  constructor(private http: HttpClient) {
    // const config = new Configuration({
    //   apiKey: this.openaiKey,
    // });
    // this.openai = new OpenAIApi(config); // Initialize the OpenAI API instance
  }

  getGTPResponse(prompt: string) {
    return this.http
      .post<{ choices: { message: { content: string } }[] }>(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 256,
        },
        {
          headers: {
            contentType: 'application/json',
            Authorization: `Bearer ${this.openaiKey}`,
          },
        }
      )
      .pipe(map((x) => x.choices[0].message.content));
  }

  // Define the response type

  // Use the defined type in your function
  getGPTResponseTwo(promptText: string) {
    const promptFormula = `
    Prompt Generation Guidelines:
  Create prompts that paint a clear picture for image generation. Use precise, visual descriptions (rather than metaphorical concepts). 
  Try to keep prompts short, yet precise, and awe-inspiring.
  Prompt Structure:
  “[time] A wide [medium] of [subject], [subject’s characteristics], [relation to background] [background]. [Details of background] [Interactions with color and lighting]. ("Taken on:"/"Drawn with:")[Specific traits of style]”
  Time:
  Impart a number to the prompt. Starting from 1 and incrementing with one for each prompt.
  Medium:
  Consider what form of art this image should be simulating.
  Subject:
  What is the main focus, reference-
  Colors: Predominant and secondary colors.
  Pose: Active, relaxed, dynamic, etc.
  Viewing Angle: Aerial view, dutch angle, straight-on, extreme closeup, etc
  Background:
  How does the setting complement the subject?
  Environment: Indoor, outdoor, abstract, etc.
  Colors: How do they contrast or harmonize with the subject?
  Lighting: Time of day, intensity, direction (e.g., backlighting).
  Style Traits:
  What are the unique artistic characteristics?
  Influences: Art movement or artist that inspired the piece.
  Technique: For paintings, how was the brush manipulated? For digital art, any specific digital technique? 
  Photo: Describe type of photography, camera gear, and camera settings. Any specific shot technique? (Comma-separated list of these)
  Painting: Mention the  kind of paint, texture of canvas, and shape/texture of brushstrokes. (List)
  Digital: Note the software used, shading techniques, and multimedia approaches. (List)
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  How would you like ChatGPT to respond?
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  1. Generate images, based on your detailed prompts using DALL E 3.
    - Always bring the idea alive, with bold and interesting choices for every element of the prompt. 
    - Always follow the Prompt Guidelines
  2. Suggest four brand new ideas that I can riff off.
    - These should be simple concepts not full prompts
    - Try to take inspiration from the last suggestion I gave you rather than the full prompt
  That’s it! I don’t need any further context. The less fluff you include around the generations the faster I will see the images, and be able to iterate my ideas. 
  Defaults (unless otherwise specified/implied):
  1. Default aspect ratio: wide (16:9).
  2. Default style: Photograph. Include camera settings, type of photography and gear.
  3. Always produce four images and suggest four new ideas.
  IMPORTANT: Avoid words or concepts that go against terms of service. Do not infringe on anyone's copyright; do not use suggestive or explicit imagery in your prompts. Do not emphasize or imply any elements that would not be considered G-rated.
  Create prompts for a movie based on the book:
  The Doctrine of the Trinity: Christianity's Self-Inflicted Wound - Hardcover
  Add to JSON a property called "original_text" in the JSON where I'll include the specific words or phrases from the text that each prompt is based on.
  Generate a JSON with the result. {time: int, original_text:string, prompt:string}.
  Use this text:
  `.replace(/\n/g, '');

    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const requestOptions = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates art prompts.',
        },
        { role: 'user', content: promptFormula },
      ],
      max_tokens: 256,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.openaiKey}`,
    };

    return this.http
      .post<GptResponse>(apiUrl, requestOptions, { headers })
      .pipe(map((x) => x.choices[0].message.content));
  }

  generateImage(prompt: string, numImages: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.openaiKey}`,
    });

    // Ensure that 'numImages' complies with the allowed range for DALL-E-3 (currently 1)
    numImages = Math.min(Math.max(numImages, 1), 1); // DALL-E-3 currently supports only one image generation at a time

    const body = {
      model: 'dall-e-3', // Specify the model here
      prompt: prompt,
      n: numImages,
      size: '1792x1024', // Choose the desired size from the available options
      // Include any other parameters you want to set, such as 'style' and 'quality'
    };

    return this.http
      .post<{ data: { id: string; url: string }[] }>(
        'https://api.openai.com/v1/images/generations',
        body,
        {
          headers,
        }
      )
      .pipe(
        map((response) => response.data.map((image) => image.url)) // Extracting the URLs of the generated images
      );
  }

  getDalleResponse(title: string) {
    return this.http
      .post<{ data: { url: string }[] }>(
        'https://api.openai.com/v1/images/generations',
        {
          prompt: title,
          n: 1,
          size: '1024x1024',
        },
        {
          headers: {
            contentType: 'application/json',
            Authorization: `Bearer ${this.openaiKey}`,
          },
        }
      )
      .pipe(map((x) => x.data[0].url));
  }
}
