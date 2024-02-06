import React from 'react';
import { BsCart3 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { AddToCartApi } from "@/apiEndpoints/cart";
import { useRouter } from 'next/navigation';
import './index.scss';
import { saveNumberOfItems } from '@/redux/slices/CartSlice';

const CartIcon = ({ itemID, quantity, showText }: { itemID: string, quantity: number, showText?: boolean }) => {
    const state = useSelector((state: any) => state.user);
    const router = useRouter();
    const dispatch = useDispatch();

    return (
        <div className="cart-icon-container" onClick={async () => {
            if (state.token) {
              const response = await  AddToCartApi({ itemID, quantity });
              if (response) {
                 dispatch(saveNumberOfItems({
                    numberOfItems: -1
                 }))
              }

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
