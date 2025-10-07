import axios from 'axios';

const cmsApiService = axios.create({
  baseURL: import.meta.env.VITE_CMS_API_URL,
});

export default cmsApiService;
