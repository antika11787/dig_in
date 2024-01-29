'use client';

import Image from "next/image";
import './index.scss';
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { removeLogin } from "@/redux/slices/UserSlice";
import { Button } from "@/components/elements/button";
import { useRouter } from "next/navigation";

type MyToken = {
    _id: string;
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
    userID?: string;
    iat: number;
    exp: number;
}

const Header = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const state = useSelector((state: any) => state.user);
    console.log("token", state.isVerified)
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
                <li className="header-li"><Link href={'/category'} className="header-link">Category</Link></li>
                <li className="header-li"><Link href={'/food'} className="header-link">Food</Link></li>
                <li className="header-li"><Link href={'/blogs'} className="header-link">Blogs</Link></li>
            </ul>

            {state.isVerified ?
                <div className="header-buttons">
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
