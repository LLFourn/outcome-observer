import axios from "axios";

const client = axios.create({
  baseURL: "https:h00.ooo",
  withCredentials: false,
  headers: {
    Accept: "application.json",
    "Content-Type": "application/json",
  },
});

export default {
  async getRoot() {
    return (await client.get("https://h00.ooo")).data;
  },
};
