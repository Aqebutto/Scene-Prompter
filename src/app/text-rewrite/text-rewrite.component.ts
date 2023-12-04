import { OpenaiService } from './../openai.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-text-rewrite',
  templateUrl: './text-rewrite.component.html',
  styleUrls: ['./text-rewrite.component.scss'],
})
export class TextRewriteComponent {
  originalText: string | undefined; // The long text input
  processedText: string = ''; // The rewritten text output

  constructor(private http: HttpClient, private openaiService: OpenaiService) {}

  async ngOnInit() {
    // Load the original text from the file when the component initializes
    this.originalText = await this.loadOriginalText();
  }

  async processText() {
    if (this.originalText) {
      const textChunks = this.sliceText(this.originalText);
      this.processedText = '';

      for (const chunk of textChunks) {
        console.log('Processing chunk:', chunk); // Log the chunk being processed

        const primeRewrite =
          'Rewrite this entire text to sound more elegant and eloquent, while not rewriting text in double quotes and while making sure that the rewritten text is of the same length as the input text: ';
        const rewrittenChunk = await this.openaiService.rewriteText(
          primeRewrite + ' ' + chunk
        );

        console.log('Rewritten chunk:', rewrittenChunk); // Log the rewritten chunk
        this.processedText += rewrittenChunk + '\n\n';
      }

      console.log('Final processed text:', this.processedText); // Log the final processed text
    }
  }

  sliceText(text: string, maxWords: number = 250): string[] {
    const words = text.split(/\s+/);
    const chunks = [];
    let startIdx = 0;

    while (startIdx < words.length) {
      let endIdx = Math.min(startIdx + maxWords, words.length);
      let chunk = words.slice(startIdx, endIdx).join(' ');

      // Extend chunk to the end of the sentence if it does not end with a sentence-ending punctuation
      if (!chunk.match(/[.!?]$/) && endIdx < words.length) {
        // Find the end of the sentence
        for (let i = endIdx; i < words.length; i++) {
          if (words[i].match(/[.!?]/)) {
            endIdx = i + 1; // Include the word with punctuation
            break;
          }
        }
        chunk = words.slice(startIdx, endIdx).join(' ');
      }

      chunks.push(chunk);
      startIdx = endIdx;
    }

    return chunks;
  }

  async loadOriginalText(): Promise<string | undefined> {
    try {
      const response = await this.http
        .get('assets/original-text.txt', { responseType: 'text' })
        .toPromise();
      return response;
    } catch (error) {
      console.error('Error loading original text:', error);
      return undefined;
    }
  }
}
