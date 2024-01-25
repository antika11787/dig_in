import axios from 'axios';
import { axiosInstance, axiosInstanceToken } from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { FormData } from '../types/interfaces';

export const SignupApi = async (formData: FormData) => {
    try {
        const response = await axiosInstance.post(`/auth/signup`, formData);
        const data = response.data;

        if (data.success === false) {
            toast.error(data.message);
        } else if (data.success === true) {
            toast.success(data.message);
            return data;
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const errorMessage = error.response.data?.message || 'An error occurred during signup';
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('No response received from the server during signup');
            } else {
                toast.error('Error setting up the signup request');
            }
        } else {
            toast.error(error.message || 'An unknown error occurred during signup');
        }
    }
};
