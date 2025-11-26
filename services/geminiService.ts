import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { StoryConfig, StoryOutput } from "../types";

// Helper function to decode base64
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper function to decode audio data (if needed, though not directly for text generation here)
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export async function generateStory(config: StoryConfig): Promise<StoryOutput> {
  // IMPORTANT: Create GoogleGenAI instance right before making an API call
  // to ensure it always uses the most up-to-date API key from the dialog.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-2.5-flash'; // Using gemini-2.5-flash for basic text tasks

  const prompt = `
Gere uma história com as seguintes características:

Gênero: ${config.genre}
Herói: ${config.hero}
Vilão: ${config.villain}

A história deve ser bem desenvolvida, incluir outros personagens interessantes criados pela IA e ter um enredo envolvente. A história deve ser rica em detalhes e com um conflito claro entre o herói e o vilão, culminando em uma resolução satisfatória.

Por favor, formate a saída da seguinte forma:

# Título da História

## Personagens
*   Herói: ${config.hero}
*   Vilão: ${config.villain}
*   [Nome do Outro Personagem 1]: [Descrição Breve]
*   [Nome do Outro Personagem 2]: [Descrição Breve]
*   ... (adicione mais personagens conforme necessário, com nome e descrição)

## Enredo
[O texto completo da história aqui, dividido em parágrafos. Cada parágrafo deve ter pelo menos 3 frases.]
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.9,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2048, // Increased token limit for longer stories
        thinkingConfig: { thinkingBudget: 512 } // Allocate some thinking budget
      }
    });

    const rawText = response.text;

    if (!rawText) {
      throw new Error("A API Gemini não retornou texto para a história.");
    }

    return parseStoryOutput(rawText);

  } catch (error: any) {
    console.error('Erro ao chamar a API Gemini:', error);
    let errorMessage = 'Falha na comunicação com a IA Gemini.';
    if (error.status) {
      errorMessage += ` (Status: ${error.status})`;
    }
    if (error.message) {
      errorMessage += ` - ${error.message}`;
    }
    throw new Error(errorMessage);
  }
}

function parseStoryOutput(rawText: string): StoryOutput {
  const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  let title = 'Título Desconhecido';
  const characters: string[] = [];
  const plotLines: string[] = [];

  let currentSection: 'title' | 'characters' | 'plot' | 'none' = 'none';

  for (const line of lines) {
    if (line.startsWith('# Título da História')) {
      // Extract title from the next line
      currentSection = 'title';
      continue;
    } else if (line.startsWith('## Personagens')) {
      currentSection = 'characters';
      continue;
    } else if (line.startsWith('## Enredo')) {
      currentSection = 'plot';
      continue;
    }

    switch (currentSection) {
      case 'title':
        title = line.replace(/^#\s*/, '').trim(); // Clean up potential markdown in title line
        currentSection = 'none'; // Title is usually a single line
        break;
      case 'characters':
        if (line.startsWith('*')) {
          characters.push(line.substring(1).trim());
        }
        break;
      case 'plot':
        plotLines.push(line);
        break;
      default:
        // If title wasn't found by its marker, try to infer the first non-empty line
        // as title before other sections are hit. This is a fallback.
        if (title === 'Título Desconhecido' && line.length > 0 && !line.startsWith('*') && !line.startsWith('##')) {
            title = line;
            currentSection = 'none';
        }
        break;
    }
  }

  // Fallback for title if the exact markdown was not followed, pick first significant line
  if (title === 'Título Desconhecido' && lines.length > 0) {
      const potentialTitle = lines[0].replace(/^#\s*/, '').trim();
      if (potentialTitle.length > 0 && !potentialTitle.startsWith('##')) { // Avoid picking section headers as title
          title = potentialTitle;
      }
  }

  return {
    title: title,
    characters: characters,
    plot: plotLines.join('\n')
  };
}