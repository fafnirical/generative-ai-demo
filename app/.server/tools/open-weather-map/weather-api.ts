interface WeatherRequest {
  /** Latitude */
  lat: number;
  /** Longitude */
  lon: number;
}

interface WeatherResponse {
  coord: {
    /** Longitude of the location */
    lon: number;
    /** Latitude of the location */
    lat: number;
  };
  /** (more info [Weather condition codes](https://openweathermap.org/weather-conditions)) */
  weather: {
    /** Weather condition id */
    id: string;
    /** Group of weather parameters (Rain, Snow, Clouds etc.) */
    main: string;
    /** Weather condition within the group */
    description: string;
    /** Weather icon id */
    icon: string;
  }[];
  main: {
    /** Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    temp: number;
    /** Temperature. This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit  */
    feels_like: number;
    /** Atmospheric pressure on the sea level, hPa */
    pressure: number;
    /** Humidity, % */
    humidity: number;
    /** Minimum temperature at the moment. This is minimal currently observed temperature (within large megalopolises and urban areas). Please find more info [here](https://openweathermap.org/current#min). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    temp_min: number;
    /** Maximum temperature at the moment. This is maximal currently observed temperature (within large megalopolises and urban areas). Please find more info [here](https://openweathermap.org/current#min). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    temp_max: number;
    /** Atmospheric pressure on the sea level, hPa */
    sea_level: number;
    /** Atmospheric pressure on the ground level, hPa */
    grnd_level: number;
  };
  /** Visibility, meter. The maximum value of the visibility is 10 km */
  visibility: number;
  wind: {
    /** Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour */
    speed: number;
    /** Wind direction, degrees (meteorological) */
    deg: number;
    /** Wind gust. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour */
    gust?: number;
  };
  clouds: {
    /** Cloudiness, % */
    all: number;
  };
  rain?: {
    /** (where available)Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter */
    '1h': number;
  };
  snow?: {
    /** (where available) Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter */
    '1h': number;
  };
  /** Time of data calculation, unix, UTC */
  dt: number;
  sys: {
    /** Country code (GB, JP etc.) */
    country: string;
    /** Sunrise time, unix, UTC */
    sunrise: number;
    /** Sunset time, unix, UTC */
    sunset: number;
  };
  /** Shift in seconds from UTC */
  timezone: number;
  /** City ID. Please note that built-in geocoder functionality has been deprecated. Learn more [here](https://openweathermap.org/current#builtin) */
  id: number;
  /** City name. Please note that built-in geocoder functionality has been deprecated. Learn more [here](https://openweathermap.org/current#builtin) */
  name: string;
}
export function currentWeather({
  lat,
  lon,
}: WeatherRequest): Promise<WeatherResponse> {
  const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY as string;

  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.search = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid: apiKey,
    units: 'imperial',
  }).toString();

  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}
