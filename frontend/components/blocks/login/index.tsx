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
        <div className='form-container'>
            <h1 className='login-header'>Log In to Your Account</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='login-form'>
                <div className='form-item'>
                    <label className='form-label'>Email</label>
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                                message: 'Enter a valid email address.',
                            },
                        }}
                        render={({ field }) => (
                            <input
                                placeholder="Enter email"
                                {...field}
                                className='form-input'
                            />
                        )}
                    />
                    {errors.email && <h5 className='error-message'>{errors.email.message}</h5>}
                </div>

                <div className="form-item">
                    <label className="form-label">Password</label>
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: 'Password is required',
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/,
                                message:
                                    'Password must contain at least one capital letter, one digit, one special character, and be 8 characters or more long.',
                            },
                        }}
                        render={({ field }) => (
                            <div className="password-input">
                                <input
                                    placeholder="Enter password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...field}
                                    className="form-input-password"
                                />
                                <button
                                    type="button"
                                    className='eye-button'
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
                    {errors.password && <h5 className='error-message'>{errors.password.message}</h5>}
                </div>

                <div className='submit-button-container'>
                    <button type="submit" className='submit-button'>Login</button>
                    <p className='form-text'>Don't have an account? <Link href="/signup" className='form-link'>Sign Up</Link></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
