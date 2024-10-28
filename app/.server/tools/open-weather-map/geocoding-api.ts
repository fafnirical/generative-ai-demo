import { z } from 'zod';

export const zipRequestSchema = z.object({
  /** Zip/post code */
  zipCode: z.coerce.string(),
  /** Country code. Please use ISO 3166 country codes. */
  countryCode: z.string(),
});
type ZipRequest = z.infer<typeof zipRequestSchema>;

export const zipResponseSchema = z.object({
  /** Specified zip/post code in the API request */
  zip: z.string(),
  /** Name of the found area */
  name: z.string(),
  /** Geographical coordinates of the centroid of found zip/post code (latitude) */
  lat: z.number(),
  /** Geographical coordinates of the centroid of found zip/post code (longitude) */
  lon: z.number(),
  /** Country of the found zip/post code */
  country: z.string(),
});
type ZipResponse = z.infer<typeof zipResponseSchema>;

export async function zip(request: ZipRequest): Promise<ZipResponse> {
  const { zipCode, countryCode } = await zipRequestSchema.parseAsync(request);

  const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY as string;

  const url = new URL('https://api.openweathermap.org/geo/1.0/zip');
  url.search = new URLSearchParams({
    zip: `${zipCode},${countryCode}`,
    appid: apiKey,
  }).toString();

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return zipResponseSchema.parseAsync(await response.json());
}
