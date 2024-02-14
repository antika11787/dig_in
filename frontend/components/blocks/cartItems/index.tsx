'use client';

import { useEffect, useState } from 'react';
import { BsCart3 } from 'react-icons/bs';
import { GetMyCartApi, ClearCartApi, CheckoutApi } from '@/apiEndpoints/cart';
import { CartResponse, ItemResponse } from '@/types/interfaces';
import { useRouter } from 'next/navigation';
import './index.scss';

const CartItems = () => {
    const router = useRouter();
    const [cartData, setCartData] = useState<CartResponse>();

    useEffect(() => {
        GetMyCartApi().then((response) => {
            setCartData(response);
        });
    }, []);

    return (
        <div className="cart-dropdown custom-scrollbar">
            <h3 className='title'>Order Summery</h3>
            {cartData && cartData.items.length > 0 ? (
                <div className="cart-items" key={cartData._id}>
                    {cartData.items.map((item: ItemResponse) => (
                        <div>
                            <div key={item._id} className="cart-item">
                                <img src={`http://localhost:3000/uploads/${typeof item.itemID === 'object' ? (item.itemID as { banner: string }).banner : ''}`}
                                    alt={item.title}
                                    className='cart-item-image' />
                                <div className="cart-item-details">
                                    <p className="cart-item-title">{typeof item.itemID === 'object' ? (item.itemID as { title: string }).title : ''}<span className='cart-item-quantity'> x {item.quantity}</span></p>
                                    <p className="cart-item-price">Total: ${item.cost}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className='cart-buttons'>
                        <p className='total-cost'>Total: ${cartData.totalAmount}</p>
                        <button className='clear-cart-button'
                            onClick={() => { ClearCartApi() }}>Clear Cart</button>
                    </div>
                </div>
            ) : (
                <p className='no-items'>No items in cart</p>
            )}
        </div>
    )
}

export default CartItems;
