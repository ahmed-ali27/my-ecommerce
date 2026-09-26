import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "https://ecommerce.routemisr.com/api/v1", // تأكد من الـ Base URL الخاص بك
});

// 🔄 Interceptor: حقن الـ Token تلقائياً في كل Request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("userToken");

    if (token) {
      // الـ API الخاص بالمتجر يقرأ الـ Token من هيدر باسم "token"
      config.headers.token = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;