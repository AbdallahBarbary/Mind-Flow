type OpenMeteoCurrent = {
  temperature_2m: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
};

export type WeatherSnapshot = {
  tempC: number;
  isRaining: boolean;
  code: number;
  label: string;
  updatedAt: string;
};

function codeToLabel(code: number): string {
  // Open-Meteo WMO weather interpretation codes (subset / simplified).
  if (code === 0) return "Clear";
  if (code === 1 || code === 2) return "Mostly clear";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog";
  if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67)) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 95 && code <= 99) return "Storm";
  return "Weather";
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherSnapshot> {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lon)}` +
    "&current=temperature_2m,precipitation,rain,showers,snowfall,weather_code" +
    "&timezone=auto";

  const res = await fetch(url);
  if (!res.ok) throw new Error(`weather_http_${res.status}`);
  const json = (await res.json()) as { current?: OpenMeteoCurrent };
  if (!json.current) throw new Error("weather_no_current");

  const c = json.current;
  const wet = (c.precipitation ?? 0) + (c.rain ?? 0) + (c.showers ?? 0);
  const isRaining = wet > 0.05 && (c.snowfall ?? 0) <= 0;

  return {
    tempC: c.temperature_2m,
    isRaining,
    code: c.weather_code,
    label: codeToLabel(c.weather_code),
    updatedAt: new Date().toISOString()
  };
}

