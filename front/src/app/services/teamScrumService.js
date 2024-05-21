import axios from "axios";

const endpoint = 'http://localhost:8080/api/teams-scrum'

export const listTeamsScrum = async () => {
    const response = await axios.get(`${endpoint}/teams`);
    return response.data;
};

export const createTeamScrum = async (team) => {
    await axios.post(`${endpoint}/createT`, team);
};

export const updateTeamScrum = async (team) => {
    await axios.put(`${endpoint}/updateT`, team);
};

export const deleteTeamScrum = async (id) => {
    await axios.delete(`${endpoint}/deleteT/${id}`);
};