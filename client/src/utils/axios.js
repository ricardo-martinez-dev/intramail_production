import axios from "axios";

export async function get(url) {
  return await axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => console.log(err));
}
