import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateImage({ prompt }: { prompt: string }) {
  const image = await openai.images.generate({
    prompt: prompt,
    model: 'dall-e-3',
    n: 1,
    quality: 'hd',
    response_format: 'url',
    size: '1024x1024',
    style: 'vivid',
  });

  return image;
}
