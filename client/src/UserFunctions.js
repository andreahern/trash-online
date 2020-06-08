import axios from "axios";

export const register = (newUser) => {
  return axios.post(`/signup`, newUser).then((response) => {
    localStorage.setItem("token", response.data.token);
    return response.data;
  });
};

export const login = (user) => {
  return axios.post(`/signin`, user).then((response) => {
    localStorage.setItem("token", response.data.token);
    return response.data;
  });
};

export const stats = (id) => {
  return axios.post(`/stats`, { id }).then((response) => {
    return response.data;
  });
};
