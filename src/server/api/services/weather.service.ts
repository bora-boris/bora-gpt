import axios from "axios";

export const getWeather = async (input: { city: string }) => {
  const response = await axios.get(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${input.city}`,
  );

  return response.data;
};
