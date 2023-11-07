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
}
