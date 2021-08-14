import axios from 'axios';

const instance = axios.create({
   baseURL: 'http://dungxbuif-localhost:4000/',
});

export default instance;
