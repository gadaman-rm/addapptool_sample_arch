import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Define a custom post function that extends axios.post
const apiPostRequest = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  // Merge custom headers with the provided config
  const customConfig: AxiosRequestConfig = {
    ...config,
    headers: {
      ...config?.headers, // Preserve existing headers
      API_VERSION: "1.0.0", // Add the version header
    },
  };

  return axios.post<T>(url, data, customConfig);
};

export default apiPostRequest;
