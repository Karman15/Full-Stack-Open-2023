import axios from "axios";
const baseUrl = "http://api.weatherstack.com/current";
const api_key = import.meta.env.VITE_SOME_KEY

const getWeather = (city) => {
  const request = axios.get(`${baseUrl}?access_key=${api_key}&query=${city}`);
  return request.then(response => response.data);
}

export default { getWeather };