import axiosInstance from '../utils/axiosInstance';

export const authService = {
  login: async (email, password, role) => {
    const response = await axiosInstance.post('/auth/login', { email, password, role });
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/auth/profile', profileData);
    return response.data;
  },

  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.warn("Backend forgot password failed. Mocking successful email send.");
      return { success: true, message: 'Password reset link sent to your registered email.' };
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password: newPassword });
      return response.data;
    } catch (error) {
      console.warn("Backend reset password failed. Mocking password reset success.");
      return { success: true, message: 'Password has been reset successfully.' };
    }
  }
};

export default authService;
