import axios from "axios";

export const BASE_YUNA_URL = "https://api.yunaapi.com/v1";

export const yunaClient = axios.create({
  baseURL: BASE_YUNA_URL,
  headers: {
    Authorization: `Bearer ${process.env.YUNA_API_KEY}`,
  },
});
