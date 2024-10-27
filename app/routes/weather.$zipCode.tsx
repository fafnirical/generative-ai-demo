import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { zip } from '../.server/tools/open-weather-map/geocoding-api';
import { currentWeather } from '../.server/tools/open-weather-map/weather-api';

export async function loader({ params }: LoaderFunctionArgs) {
  const zipCode = params.zipCode!;

  const geolocation = await zip({ zipCode, countryCode: 'us' });
  const weather = await currentWeather(geolocation);

  return json(weather);
}

export default function Weather() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <div className="mx-auto mt-16 min-w-full max-w-sm sm:min-w-[368px]">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
