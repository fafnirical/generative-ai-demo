import { z } from 'zod';

export const weatherRequestSchema = z.object({
  /** Latitude */
  lat: z.number(),
  /** Longitude */
  lon: z.number(),
});
type WeatherRequest = z.infer<typeof weatherRequestSchema>;

export const weatherResponseSchema = z.object({
  coord: z.object({
    /** Longitude of the location */
    lon: z.number(),
    /** Latitude of the location */
    lat: z.number(),
  }),
  /** (more info [Weather condition codes](https://openweathermap.org/weather-conditions)) */
  weather: z.array(
    z.object({
      /** Weather condition id */
      id: z.number(),
      /** Group of weather parameters (Rain, Snow, Clouds etc.) */
      main: z.string(),
      /** Weather condition within the group */
      description: z.string(),
      /** Weather icon id */
      icon: z.string(),
    }),
  ),
  main: z.object({
    /** Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    temp: z.number(),
    /** Temperature. This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit  */
    feels_like: z.number(),
    /** Atmospheric pressure on the sea level, hPa */
    pressure: z.number(),
    /** Humidity, % */
    humidity: z.number(),
    /** Minimum temperature at the moment. This is minimal currently observed temperature (within large megalopolises and urban areas). Please find more info [here](https://openweathermap.org/current#min). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    temp_min: z.number(),
    /** Maximum temperature at the moment. This is maximal currently observed temperature (within large megalopolises and urban areas). Please find more info [here](https://openweathermap.org/current#min). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    temp_max: z.number(),
    /** Atmospheric pressure on the sea level, hPa */
    sea_level: z.number(),
    /** Atmospheric pressure on the ground level, hPa */
    grnd_level: z.number(),
  }),
  /** Visibility, meter. The maximum value of the visibility is 10 km */
  visibility: z.number(),
  wind: z.object({
    /** Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour */
    speed: z.number(),
    /** Wind direction, degrees (meteorological) */
    deg: z.number(),
    /** Wind gust. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour */
    gust: z.number().optional(),
  }),
  clouds: z.object({
    /** Cloudiness, % */
    all: z.number(),
  }),
  rain: z
    .object({
      /** (where available) Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter */
      '1h': z.number(),
    })
    .optional(),
  snow: z
    .object({
      /** (where available) Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter */
      '1h': z.number(),
    })
    .optional(),
  /** Time of data calculation, unix, UTC */
  dt: z.number(),
  sys: z.object({
    /** Country code (GB, JP etc.) */
    country: z.string(),
    /** Sunrise time, unix, UTC */
    sunrise: z.number(),
    /** Sunset time, unix, UTC */
    sunset: z.number(),
  }),
  /** Shift in seconds from UTC */
  timezone: z.number(),
  /** City ID. Please note that built-in geocoder functionality has been deprecated. Learn more [here](https://openweathermap.org/current#builtin) */
  id: z.number(),
  /** City name. Please note that built-in geocoder functionality has been deprecated. Learn more [here](https://openweathermap.org/current#builtin) */
  name: z.string(),
});
type WeatherResponse = z.infer<typeof weatherResponseSchema>;

export async function currentWeather(
  request: WeatherRequest,
): Promise<WeatherResponse> {
  const { lat, lon } = await weatherRequestSchema.parseAsync(request);

  const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY as string;

  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.search = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid: apiKey,
    units: 'imperial',
  }).toString();

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await weatherResponseSchema.parseAsync(await response.json());
}
