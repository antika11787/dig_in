'use client';

import { useEffect, useState } from 'react';
import { BsCart3 } from 'react-icons/bs';
import { GetMyCartApi, ClearCartApi, CheckoutApi, AddToCartApi, UpdateQuantityApi, RemoveFromCartApi } from '@/apiEndpoints/cart';
import { CartResponse, ItemResponse } from '@/types/interfaces';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import './index.scss';
import appConfig from '@/config/constants';

const CartItems = () => {
    const router = useRouter();
    const pathName = usePathname();
    const [item, setItem] = useState<ItemResponse>();
    const [quantity, setQuantity] = useState<number>(1);
    const [cartData, setCartData] = useState<CartResponse>();

    const updateQuantity = (increment: number) => {
        const newQuantity = quantity + increment;
        setQuantity(newQuantity);
        if (newQuantity === 0) {
            RemoveFromCartApi(item?._id || "");
            return;
        }
        if (newQuantity === 1) {
            AddToCartApi({ itemID: item?._id || "", quantity: newQuantity });
            return;
        }
        UpdateQuantityApi({ itemID: item?._id || "", quantity: newQuantity });
    };

    useEffect(() => {
        GetMyCartApi().then((response) => {
            setCartData(response);
        });
    }, [quantity]);

    return (
        <div className="cart-dropdown custom-scrollbar">
            <h3 className='title'>Order Summery</h3>
            {cartData && cartData.items.length > 0 ? (
                <div className="cart-items" key={cartData._id}>
                    {cartData.items.map((item: ItemResponse) => (
                        <div key={item._id}>
                            <div key={item._id} className="cart-item">
                                <Image
                                    src={`${appConfig.nextPublicApiBaseUrl}/uploads/${typeof item.itemID === 'object' ? (item.itemID as { banner: string }).banner : ''}`}
                                    alt="item-banner"
                                    width={100}
                                    height={100}
                                    className='cart-item-image' />
                                <div className="cart-item-details">
                                    <div className='cart-item-title-container'>
                                        <p className="cart-item-title">
                                            {typeof item.itemID === 'object' ? (item.itemID as { title: string }).title : ''}
                                            <span className='cart-item-quantity'> x {item.quantity}</span>
                                        </p>

                                    </div>
                                    <div className='cart-item-price-container'>
                                        <p className="cart-item-price">Item price: BDT {" "}
                                            <span style={{ fontWeight: "bold" }}>
                                                {typeof item.itemID === 'object' ? (item.itemID as { price: number }).price : ''}
                                            </span>
                                        </p>
                                        <p className='cart-item-price'>Total cost: BDT <span style={{ fontWeight: "bold" }}>{item.cost}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {pathName !== '/checkout' ? (
                        <div className='cart-buttons'>
                            <p className='total-cost'>Total: BDT {cartData.totalAmount}</p>
                            <button className='clear-cart-button'
                                onClick={() => { ClearCartApi() }}>Clear Cart</button>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            ) : (
                <div>
                    <Image src="/no-cart.png" alt="no items" width={300} height={300} />
                    <p className='no-items'>No items in cart</p>
                </div>
            )}
        </div>
    )
}

export default CartItems;
