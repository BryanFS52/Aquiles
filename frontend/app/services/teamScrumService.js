import axios from "axios";

const endpoint = 'http://localhost:8081/api/teamScrum';

export const listTeamsScrum = () => {
    return axios.get(`${endpoint}/all`).then(response => response.data);
};

export const createTeamScrum = (team) => {
    return axios.post(`${endpoint}/create`, { data: team });
};

export const updateTeamScrum = (team) => {
    return axios.put(`${endpoint}/update`, team);
};

export const deleteTeamScrum = (id) => {
    return axios.delete(`${endpoint}/delete/${id}`);
};

export const getTeamScrumById = (id) => {
    return axios.get(`${endpoint}/${id}`).then(response => response.data);
};