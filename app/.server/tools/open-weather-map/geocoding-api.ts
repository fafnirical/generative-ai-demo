interface ZipRequest {
  /** Zip/post code */
  zipCode: string;
  /** Country code. Please use ISO 3166 country codes. */
  countryCode: string;
}
interface ZipResponse {
  /** Specified zip/post code in the API request */
  zip: string;
  /** Name of the found area */
  name: string;
  /** Geographical coordinates of the centroid of found zip/post code (latitude) */
  lat: number;
  /** Geographical coordinates of the centroid of found zip/post code (longitude) */
  lon: number;
  /** Country of the found zip/post code */
  country: string;
}
export function zip({
  zipCode,
  countryCode,
}: ZipRequest): Promise<ZipResponse> {
  const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY as string;

  const url = new URL('https://api.openweathermap.org/geo/1.0/zip');
  url.search = new URLSearchParams({
    zip: `${zipCode},${countryCode}`,
    appid: apiKey,
  }).toString();

  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}
