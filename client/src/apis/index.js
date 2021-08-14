import axios from './apiClient';

export const getGroupEvents = () =>
   axios.get('api/spreadsheets/get-group-events');

export const getAllEvents = () => axios.get('api/spreadsheets/get-all-events');

export const getAllRules = () => axios.get('api/spreadsheets/get-all-rules');

export const createNewRule = (data) => axios.post('api/create-new-rule', data);
