import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import type { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { weatherResponseSchema } from '../open-weather-map/weather-api';

type Weather = z.infer<typeof weatherResponseSchema>;

export async function weatherToDescription({ weather }: { weather: Weather }) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You will be provided with structured data, using the following JSON Schema format:',
      },
      {
        role: 'system',
        content: JSON.stringify(zodToJsonSchema(weatherResponseSchema)),
      },
      {
        role: 'system',
        content:
          'Convert the structured data into a description of the weather. The description should include the weather conditions, including if it is sunny, cloudy, rainy, snowy, windy, etc.',
      },
      {
        role: 'user',
        content: JSON.stringify(weather),
      },
    ],
    model: 'gpt-4o-mini',
    n: 1,
    temperature: 0.2,
  });

  return completion;
}

export async function weatherDescriptionToImagePrompt({
  weatherDescription,
}: {
  weatherDescription: string;
}) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You will be provided with a description of weather.',
      },
      {
        role: 'system',
        content:
          'Convert the description of the weather into a prompt for generating an image using DALL-E 3. It should start with "A picture of a cat" and include the weather conditions.',
      },
      {
        role: 'system',
        content:
          'The prompt should mention the weather conditions in a way that is visually descriptive, but not overly specific. It also should not include any information that is not present in the description of the weather.',
      },
      {
        role: 'system',
        content:
          'For example, if the weather description is "It is sunny with a temperature of 75 degrees Fahrenheit and a light breeze", the prompt should be "A picture of a cat in sunny weather and a light breeze."',
      },
      {
        role: 'assistant',
        content: weatherDescription,
      },
    ],
    model: 'gpt-4o-mini',
    n: 1,
    temperature: 0.2,
  });

  return completion;
}
