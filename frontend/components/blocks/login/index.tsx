'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FormDataLogin } from '@/types/interfaces';
import { LoginApi } from '@/apiEndpoints/auth';
import { useDispatch } from 'react-redux';
import { saveLogin } from "../../../redux/slices/UserSlice";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import './index.scss';

const LoginForm = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data: FormDataLogin) => {
        try {
            const response = await LoginApi(data);
            dispatch(saveLogin(response.data));
            router.push('/');
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className='login-form-container'>
            <h1 className='login-header'>Log In to Your Account</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='login-form'>
                <div className='login-form-item'>
                    <label className='login-form-label'>Email</label>
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: 'Email is required',
                        }}
                        render={({ field }) => (
                            <input
                                placeholder="Enter email"
                                {...field}
                                className='login-form-input'
                            />
                        )}
                    />
                    {errors.email && <h5 className='login-error-message'>{errors.email.message}</h5>}
                </div>

                <div className="login-form-item">
                    <label className="login-form-label">Password</label>
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: 'Password is required',
                        }}
                        render={({ field }) => (
                            <div className="login-password-input">
                                <input
                                    placeholder="Enter password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...field}
                                    className="login-form-input-password"
                                />
                                <button
                                    type="button"
                                    className='login-eye-button'
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <FiEyeOff />
                                    ) : (
                                        <FiEye />
                                    )}
                                </button>
                            </div>
                        )}
                    />
                    {errors.password && <h5 className='login-error-message'>{errors.password.message}</h5>}
                </div>

                <div className='login-submit-button-container'>
                    <button type="submit" className='login-submit-button'>Login</button>
                    <p className='signup-form-text'>Don't have an account? <Link href="/signup" className='signup-form-link'>Sign Up</Link></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
