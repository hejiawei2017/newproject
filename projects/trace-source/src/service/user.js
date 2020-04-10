import axios from 'axios';

export default {
  login(user) {
    return axios.get('/api/login', { params: user });
  },
  logout() {
    return axios.get('/api/logout');
  }
};
