import axios from './apiClient';

export const getGroupEvents = () => axios.get('/spreadsheets/get-group-events');
