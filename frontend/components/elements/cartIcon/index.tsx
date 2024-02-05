import React from 'react';
import { BsCart3 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { AddToCartApi } from "@/apiEndpoints/cart";
import { useRouter } from 'next/navigation';
import './index.scss';

const CartIcon = ({ itemID, quantity, showText }: { itemID: string, quantity: number, showText?: boolean }) => {
    const state = useSelector((state: any) => state.user);
    const router = useRouter();

    return (
        <div className="cart-icon-container" onClick={() => {
            if (state.token) {
                AddToCartApi({ itemID, quantity })
            }
            else {
                router.push('/login');
            }
        }}>
            <BsCart3 className="cart-icon" />
            {showText && <p className="cart-icon-text">Add to Cart</p>}
        </div>
    );
}

export default CartIcon;
