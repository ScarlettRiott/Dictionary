import axios from "axios";

const API_KEY = "fe0737e9-2f50-4be3-9854-61845844cf1d";
const BASE_URL =
  "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";

export const getWordDefinition = async (word) => {
  try {
    const response = await axios.get(`${BASE_URL}${word}?key=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
