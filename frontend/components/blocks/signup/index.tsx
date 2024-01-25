'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FormData } from '@/types/interfaces';
import useCustomHooks from '@/hooks/useCustomHooks';
// import { SignupApi } from '@/apiEndpoints/auth';

import './index.scss';

const SignUpForm = () => {
    const { signup } = useCustomHooks();
    const {
        handleSubmit,
        control,
        formState: { errors },
        watch,
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            username: '',
            email: '',
            role: 'customer',
            address: '',
            password: '',
            confirm_password: '',
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const onSubmit = async (data: FormData) => {
        console.log(data);
        signup(data);
    };

    return (
        <div className='form-container'>
            <h1 className='signup-header'>Create a New Account</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='signup-form'>
                <div className='form-item'>
                    <label className='form-label'>Username</label>
                    <Controller
                        name="username"
                        control={control}
                        rules={{
                            required: 'Username is required',
                            minLength: {
                                value: 4,
                                message: 'Minimum length must be 4',
                            },
                            maxLength: {
                                value: 30,
                                message: 'Maximum length must be 30',
                            },
                        }}
                        render={({ field }) => (
                            <input
                                placeholder="Enter username"
                                {...field}
                                className='form-input'
                            />
                        )}
                    />
                    {errors.username && <h5 className='error-message'>{String(errors.username.message)}</h5>}
                </div>

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

                <div className='form-item'>
                    <label className='form-label'>Role</label>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                className='form-input'
                            >
                                <option value="customer">Customer</option>
                                <option value="author">Author</option>
                            </select>
                        )}
                    />
                </div>

                <div className='form-item'>
                    <label className='form-label'>Address</label>
                    <Controller
                        name="address"
                        control={control}
                        rules={{
                            required: 'Address is required',
                        }}
                        render={({ field }) => (
                            <input
                                placeholder="Enter address"
                                {...field}
                                className='form-input'
                            />
                        )}
                    />
                    {errors.address && <h5 className='error-message'>{errors.address.message}</h5>}
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
                                    className="form-input"
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

                <div className="form-item">
                    <label className="form-label">Confirm Password</label>
                    <Controller
                        name="confirm_password"
                        control={control}
                        rules={{
                            required: 'Confirm your password',
                            validate: (value) =>
                                value === watch('password') || 'Confirm password should match given password',
                        }}
                        render={({ field }) => (
                            <div className="password-input">
                                <input
                                    placeholder="Confirm password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...field}
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    className='eye-button'
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? (
                                        <FiEyeOff className="h-6 w-6 text-gray-500" />
                                    ) : (
                                        <FiEye className="h-6 w-6 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        )}
                    />
                    {errors.confirm_password && (
                        <div>
                            <h5 className='error-message'>{errors.confirm_password.message}</h5>
                        </div>
                    )}
                </div>

                <div className='submit-button-container'>
                    <button type="submit" className='submit-button'>Sign Up</button>
                    <p className='form-text'>Already have an account? Login</p>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;
