import axios from './apiClient';

export const getGroupEvents = () => axios.get('/spreadsheets/get-group-events');

export const getAllEvents = () => axios.get('/spreadsheets/get-all-events');

export const getAllRules = () => axios.get('/spreadsheets/get-all-rules');

export const createNewRule = (data) => axios.post('/create-new-rule', data);
