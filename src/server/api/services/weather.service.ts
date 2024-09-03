import axios from "axios";

export const getWeather = async (input: { city: string }) => {
  try {
    /* const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${input.city}&aqi=no`,
    ); */
    const response = await axios.get(
      `https://api.weatherbit.io/v2.0/current?city=${input.city}&units=I&key=${process.env.OPEN_WEATHER_API_KEY}`,
    );

    return response.data;
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error}`);
  }
};
