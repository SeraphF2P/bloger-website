import axios, {type AxiosError } from "axios";


const axiosClient = axios.create({
  baseURL:"/api/",
});

axiosClient.interceptors.request.use((config) => {
  console.log(config.params)
  // const token = localStorage.getItem("token");
  // config.headers.Authorization = `Bearer ${token || ""}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (error:AxiosError) => {
    
    if (error.status === 401) {
      // localStorage.removeItem("token");
  //  typeof window !== "undefined" && window.location.reload();
    } else if (error.status === 404) {
      //Show not found
    }

    throw error;
  }
);

export default axiosClient;
