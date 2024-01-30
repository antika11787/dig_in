'use client';

import Image from "next/image";
import './index.scss';
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { removeLogin } from "@/redux/slices/UserSlice";
import { Button } from "@/components/elements/button";
import { useRouter } from "next/navigation";
import { GetCategoriesApi } from "@/apiEndpoints/category";
import { useEffect, useState } from "react";
import { CategoryResponse, CartResponse } from "@/types/interfaces";
import { BsCart3 } from "react-icons/bs";
import { GetMyCartApi } from "@/apiEndpoints/cart";

const Header = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    // const { id } = useParams();
    const state = useSelector((state: any) => state.user);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [cart, setCart] = useState<CartResponse[]>([]);

    useEffect(() => {
        GetCategoriesApi().then((response) => {
            setCategories(response);
        })
    }, []);

    useEffect(() => {
        GetMyCartApi().then((response) => {
            setCart(response);
        })
    }, []);

    console.log("cart", cart.length > 0 ? cart[0].items : []);

    const logout = () => {
        dispatch(removeLogin());
        router.push('/login');
    }
    return (
        <div className="header-container">
            <div className="image-container">
                <Link href={'/'}><Image height={50} width={50} src={'/logo.png'} alt="logo" /></Link>
            </div>
            <ul className="header-ul">
                <li className="header-li"><Link href={'/'} className="header-link">Home</Link></li>
                <li className="header-li">
                    {categories.length > 0 && <Link href={`/categories/${categories[0]._id}`} className="header-link">Categories</Link>}
                </li>
                <li className="header-li"><Link href={'/items'} className="header-link">Items</Link></li>
                <li className="header-li"><Link href={'/blogs'} className="header-link">Blogs</Link></li>
            </ul>

            {state.isVerified ?
                <div className="header-buttons">
                    {cart.length > 0 && <Link href={'/cart'}><BsCart3 className="cart-icon" /></Link>}
                    <BsCart3 className="cart-icon" />
                    <Image className="profile-image" height={35} width={35} src={'/user.png'} alt="profile" onClick={() => { router.push('/profile') }} />
                    <Button type="button" value="Logout" additionalStyle="logout-button" onClick={() => {
                        logout();
                        router.push('/login')
                    }} />
                </div> :
                <div className="header-buttons">
                    <Button type="button" value="Login" additionalStyle="login-button" onClick={() => { router.push('/login') }} />
                    <Button type="button" value="signup" additionalStyle="signup-button" onClick={() => { router.push('/signup') }} />
                </div>}
        </div>
    )
}

export default Header;
