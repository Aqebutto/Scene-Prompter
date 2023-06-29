import axios from 'axios';
import readline from 'readline';

// readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// OpenAI endpoint
const endpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions';

// Set your OpenAI API key here
const apiKey = 'your_openai_api_key_here';

// Function to prompt question to user
function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer: string) => {
      resolve(answer);
    });
  });
}

// Function to prompt OpenAI with a question
async function promptOpenAI(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      endpoint,
      { prompt, max_tokens: 150 },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error(error);
    return '';
  }
}

// Main function
async function main() {
  while (true) {
    const question = await askQuestion('You: ');
    if (question.toLowerCase() === 'quit') break;

    const answer = await promptOpenAI(question);
    console.log(`AI: ${answer}`);
  }

  rl.close();
}

main();
