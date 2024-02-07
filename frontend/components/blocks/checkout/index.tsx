'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { AddressData, CartResponse } from '@/types/interfaces';
import { CheckoutApi, GetMyCartApi } from '@/apiEndpoints/cart';
import { loadStripe } from '@stripe/stripe-js';
import appConfig from '@/config/constants';
import { toast } from "react-toastify";
import Link from 'next/link';

import './index.scss';

const Checkout = () => {
    const [cartData, setCartData] = useState<CartResponse>();

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            house: '',
            street: '',
            area: ''
        },
    });

    const onSubmit = async (data: AddressData) => {
        try {
            const response = await CheckoutApi(data);
            const url = response;
            console.log(url);

            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <div className='checkout-form-container'>
            <h4 className='checkout-header'>Please provide your address</h4>
            <form onSubmit={handleSubmit(onSubmit)} className='checkout-form'>
                <div className='checkout-form-item'>
                    <label className='checkout-form-label'>House</label>
                    <Controller
                        name="house"
                        control={control}
                        rules={{
                            required: 'House number/name is required',
                        }}
                        render={({ field }) => (
                            <input
                                placeholder="Enter house no./name"
                                {...field}
                                className='checkout-form-input'
                            />
                        )}
                    />
                    {errors.house && <h5 className='checkout-error-message'>{errors.house.message}</h5>}
                </div>

                <div className='checkout-form-item'>
                    <label className='checkout-form-label'>Street</label>
                    <Controller
                        name="street"
                        control={control}
                        rules={{
                            required: 'Street is required',
                        }}
                        render={({ field }) => (
                            <input
                                placeholder="Enter street/block"
                                {...field}
                                className='checkout-form-input'
                            />
                        )}
                    />
                    {errors.street && <h5 className='checkout-error-message'>{errors.street.message}</h5>}
                </div>

                <div className='checkout-form-item'>
                    <label className='checkout-form-label'>Area</label>
                    <Controller
                        name="area"
                        control={control}
                        rules={{
                            required: 'Area is required',
                        }}
                        render={({ field }) => (
                            <input
                                placeholder="Enter your area"
                                {...field}
                                className='checkout-form-input'
                            />
                        )}
                    />
                    {errors.area && <h5 className='checkout-error-message'>{errors.area.message}</h5>}
                </div>

                <div className='checkout-submit-button-container'>
                    <button type="submit" className='checkout-submit-button'>Checkout and Pay</button>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
