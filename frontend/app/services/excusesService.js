// src/services/excusesService.js

import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/excuses'; // Cambia la URL según sea necesario

export const getAllExcuses = async () => {
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data;
};

export const createExcuse = async (excuseData) => {
    await axios.post(`${BASE_URL}/create`, excuseData);
};

export const updateExcuse = async (excuseData) => {
    await axios.put(`${BASE_URL}/update`, excuseData);
};

export const deleteExcuse = async (excuseId) => {
    await axios.delete(`${BASE_URL}/delete/${excuseId}`);
};

export const getExcusesBySession = async (sessionId) => {
    const response = await axios.get(`${BASE_URL}/session/${sessionId}`);
    return response.data;
};
