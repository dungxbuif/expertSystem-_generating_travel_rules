import axios from 'axios';

const instance = axios.create({
   baseURL: 'http://localhost:4000/api',
   // headers: { api_key: 'MY_TRACKING_COVID' },
});

export default instance;
