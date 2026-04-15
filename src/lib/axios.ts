import axios from "axios";

const instance = axios.create({
  // Use a relative path to work with your Next.js rewrite
  baseURL: "/", 
  
  // This is mandatory for sending session cookies
  withCredentials: true, 
});

// Response interceptor: on 401, we just reject.
// The AuthContext and RequireAuth will manage redirects.
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;