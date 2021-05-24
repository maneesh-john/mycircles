import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import store from "../redux/store";
import { BASE_URL, DOVEMED_API_URL } from "../constants/config";
const { getState }: any = store;
import { encode } from "base-64";

//image upload
const image_upload: AxiosInstance = axios.create();

//dovemed other directory list
const k8Staging: AxiosInstance = axios.create({
  baseURL: "https://stage.k8s.dovemed.com/api/v1",
  headers: {
    Authorization: `Basic ZG92ZW1lZDpkb3ZlbWVkLXJ1bGVz`,
  },
});

const udayanK8Staging: AxiosInstance = axios.create({
  baseURL: "https://stage.k8s.dovemed.com/api/v1",
  headers: {
    Authorization: `Basic ZG92ZW1lZDpkb3ZlbWVkLXJ1bGVz`,
  },
});
// k8Staging.interceptors.request.use(async function (config: AxiosRequestConfig) {
//   config.headers.Authorization = `Basic ${encode("dovemed:dovemed-rules")}`;
//   // {
//   //   username: "dovemed",
//   //   password: "dovemed-rules",
//   // }; //`Basic ${encode("dovemed:dovemed-rules")}`;
//   config.headers["X-Requested-With"] = "XMLHttpRequest";
//   return config;
// });

//dovemed physician list
const dovemedRequest: AxiosInstance = axios.create({
  baseURL: DOVEMED_API_URL,
});

dovemedRequest.interceptors.request.use(async function (
  config: AxiosRequestConfig
) {
  let token: any = getState()?.app?.token;
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

//base app requests
const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

http.interceptors.request.use(async function (config: AxiosRequestConfig) {
  let token: any = getState()?.app?.token;
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

http.interceptors.response.use(
  async function (res: AxiosResponse) {
    return res.data;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

//stage hospital,clinic etc...
const stage: AxiosInstance = axios.create({
  baseURL:
    "https://cors-anywhere.herokuapp.com/https://stage.k8s.dovemed.com/api/v1/rating/",
});

stage.interceptors.request.use(async function (config: AxiosRequestConfig) {
  config.headers.Authorization = `Basic ${encode("dovemed:dovemed-rules")}`;
  config.headers["X-Requested-With"] = "XMLHttpRequest";
  return config;
});

stage.interceptors.response.use(
  async function (res: AxiosResponse) {
    return res.data;
  },
  function (error: any) {
    return Promise.reject(error.response.data);
  }
);

// const baseURL: string = BASE_URL;

// const http = {
//     get: async (url: string) => {
//         try {
//             const res = await request(url, 'get');
//             return res;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     },
//     post: async (url: string, body?: any) => {
//         try {
//             const res = await request(url, 'post', body)
//             return res;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     },
//     put: async (url: string, body?: any) => {
//         try {
//             const res = await request(url, 'put', body)
//             return res;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     },
//     delete: async (url: string, body?: any) => {
//         try {
//             const res = await request(url, 'delete', body)
//             return res;
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }
// }

// const request = async (url: string, method: string, body?: any) => {
//     try {
//         const token: any = getState()?.app?.token;
//         const headers: any = {
//             'Content-Type': 'application/json;charset=UTF-8',
//             'Accept': 'application/json',
//         }
//         if (token) {
//             headers['Authorization'] = `Bearer ${token}`
//         }
//         const response: any = await fetch(`${baseURL}${url}`, {
//             method,
//             headers,
//             body: JSON.stringify(body)
//         })
//         console.log(response)
//         const formattedResponse: any = await response.json();
//         console.log(formattedResponse)
//         if (formattedResponse.status < 400) {
//             return formattedResponse;
//         } else {
//             throw new Error(formattedResponse.message);
//         }
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

export {
  http,
  image_upload,
  dovemedRequest,
  stage,
  k8Staging,
  udayanK8Staging,
};
