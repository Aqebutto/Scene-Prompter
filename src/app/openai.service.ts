import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    Prompt Structure: "A [medium] of [subject], [subject’s characteristics], [relation to background] [background]. [Details of background] [Interactions with color and lighting]. ("Taken on:"/"Drawn with:")[Specific traits of style]”
    Medium: Consider what form of art this image should be simulating.
    Subject: ${promptText}
    Colors: Predominant and secondary colors.
    Pose: Active, relaxed, dynamic, etc.
    Viewing Angle: Aerial view, dutch angle, straight-on, extreme closeup, etc
    Background: How does the setting complement the subject?
    Environment: Indoor, outdoor, abstract, etc.
    Colors: How do they contrast or harmonize with the subject?
    Lighting: Time of day, intensity, direction (e.g., backlighting).
    Style Traits: What are the unique artistic characteristics?
    Influences: Art movement or artist that inspired the piece.
    Technique: For paintings, how was the brush manipulated? For digital art, any specific digital technique?
    Photo: Describe type of photography, camera gear, and camera settings. Any specific shot technique? (Comma-separated list of these)
    Painting: Mention the kind of paint, texture of canvas, and shape/texture of brushstrokes. (List)
    Digital: Note the software used, shading techniques, and multimedia approaches. (List)
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

  // async generateImage(prompt: string, numImages: number, imageSize: string) {
  //   try {
  //     // const response = await this.openai.createImage({
  //     //   prompt,
  //     //   n: numImages,
  //     //   size: imageSize,
  //     // });
  //     return response;
  //   } catch (error) {
  //     console.error('Error generating image:', error);
  //     throw error;
  //   }
  // }

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
