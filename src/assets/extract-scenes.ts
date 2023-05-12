import * as fs from 'fs';

interface Scene {
  time: number;
  original_text: string;
  prompt: string;
}

const scenes: Scene[] = [];

// Read the contents of the file
fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Split the text into scenes
  const lines = data.split('====');
  for (const line of lines) {
    const sceneData = line.trim();
    if (sceneData) {
      const timeMatch = sceneData.match(/Time: (\d+):/);
      const originalTextMatch = sceneData.match(
        /Find a subject\(s\) and activity in this text:\n(.+)/s
      );
      const promptMatch = sceneData.match(
        /Now use that subject\(s\) and activity to make a prompt\n(.+)/s
      );

      if (timeMatch && originalTextMatch && promptMatch) {
        const time = parseInt(timeMatch[1], 10);
        const originalText = originalTextMatch[1].trim();
        const prompt = promptMatch[1].trim();

        scenes.push({
          time,
          original_text: originalText,
          prompt,
        });
      }
    }
  }

  console.log(scenes);
});
