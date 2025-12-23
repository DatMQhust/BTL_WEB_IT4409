import api from './api';

const updateProfile = (data) => {
  return api.patch('/user/me', data);
};

const userService = {
  updateProfile,
};

export default userService;
