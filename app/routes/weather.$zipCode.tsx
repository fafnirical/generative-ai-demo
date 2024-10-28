import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { zip } from '../.server/tools/open-weather-map/geocoding-api';
import { currentWeather } from '../.server/tools/open-weather-map/weather-api';
import { generateImage } from '../.server/tools/openai/image-generation';
import {
  weatherDescriptionToImagePrompt,
  weatherToDescription,
} from '../.server/tools/openai/weather-to-prompt';

export async function loader({ params }: LoaderFunctionArgs) {
  const zipCode = params.zipCode!;

  const weather = await zip({ zipCode, countryCode: 'us' }).then(
    (geolocation) => currentWeather(geolocation),
  );

  const weatherDescription = await weatherToDescription({ weather }).then(
    (completion) => completion.choices[0].message.content!,
  );

  const imagePrompt = await weatherDescriptionToImagePrompt({
    weatherDescription,
  }).then((completion) => completion.choices[0].message.content!);

  const image = await generateImage({ prompt: imagePrompt }).then(
    (image) => image.data[0].url,
  );

  return json({ weather, weatherDescription, imagePrompt, image });
}

export default function Weather() {
  const { weather, weatherDescription, imagePrompt, image } =
    useLoaderData<typeof loader>();

  useEffect(() => {
    console.log(weather);
    console.log(weatherDescription);
    console.log(imagePrompt);
  }, [weather, weatherDescription, imagePrompt]);

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <div className="mx-auto mt-16 min-w-full max-w-[1024px] sm:min-w-[368px]">
          <p>{weatherDescription}</p>
          <img src={image} alt={imagePrompt} />
        </div>
      </div>
    </div>
  );
}
