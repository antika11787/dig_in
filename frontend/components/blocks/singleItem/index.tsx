'use client';

import './index.scss';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ItemResponse } from '@/types/interfaces';
import { AddToCartApi, GetMyCartApi, RemoveFromCartApi, UpdateQuantityApi } from '@/apiEndpoints/cart';
import { GetItemByIdApi } from '@/apiEndpoints/item';
import CartIcon from '@/components/elements/cartIcon';

const SingleItem = () => {
    const { id } = useParams();
    const [item, setItem] = useState<ItemResponse>();
    const [quantity, setQuantity] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            const itemId = Array.isArray(id) ? id[0] : id;
            const [itemResponse, cartResponse] = await Promise.all([
                GetItemByIdApi(itemId),
                GetMyCartApi()
            ]);
            setItem(itemResponse);
            const initialQuantity = cartResponse?.items.find((item: any) => item.itemID._id === itemId)?.quantity || 0;
            setQuantity(initialQuantity);

            console.log("Cart response:", cartResponse);
            console.log("Initial quantity:", initialQuantity);
            console.log("Itemresponse:", itemResponse);
        };
        fetchData();
    }, [id]);

    const updateQuantity = (increment: number) => {
        const newQuantity = quantity + increment;
        setQuantity(newQuantity);
        if (newQuantity === 0) {
            RemoveFromCartApi(item?._id || '');
            return;
        }
        if (newQuantity === 1) {
            AddToCartApi({ itemID: item?._id || '', quantity: newQuantity });
            return;
        }
        UpdateQuantityApi({ itemID: item?._id || '', quantity: newQuantity });
    };

    return (
        <div className='single-item-container'>
            {item && (
                <>
                    <img src={`http://localhost:3000/uploads/${item.banner}`} className='single-item-banner' />
                    <div className='single-item-details'>
                        <h1 className='single-item-title'>{item.title}</h1>
                        <p className='single-item-description'>{item.description}</p>
                        <div className='price-and-quantity'>
                            <p className='single-item-price'>Price: ${item.price}</p>
                            <div className='add-to-cart'>
                                <CartIcon itemID={item._id || ''} quantity={1} showText={true} />
                            </div>
                            <div className='quantity-increment'>
                                <button className='quantity-button' onClick={() => updateQuantity(-1)} disabled={quantity === 0}>-</button>
                                <p className='quantity'>{quantity}</p>
                                <button className='quantity-button' onClick={() => updateQuantity(1)} disabled={quantity === 50}>+</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SingleItem;
