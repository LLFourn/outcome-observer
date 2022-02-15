import axios from "axios";

// const client = axios.create({
//   withCredentials: false,
//   headers: {
//     Accept: "application.json",
//     "Content-Type": "application/json",
//   },
// });

export default {
  async getOracle(oracle,path) {
    let url = "https://" + oracle;
    // if (oracle == "dev") {
    //   url = "/_dev"
    // }

    if (path != null) {
      url += path
    }

    let res = await axios(url);
    return res.data;
  }
}
