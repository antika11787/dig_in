'use client';

import Image from "next/image";
import './index.scss';
import Link from "next/link";

const Header = () => {
    return (
        <div className="header-container">
            <div className="image-container">
                <Image height={50} width={50} src={'/logo.png'} alt="logo" />
            </div>
            {/* <nav className="header-nav"> */}
                <ul className="header-ul">
                    <li className="header-li"><Link href={'/'} className="header-link">Home</Link></li>
                    <li className="header-li"><Link href={'/about'} className="header-link">About</Link></li>
                    <li className="header-li"><Link href={'/contact'} className="header-link">Contact</Link></li>
                </ul>
            {/* </nav> */}
            <div className="header-buttons">
                <button className="header-button-signup">Sign Up</button>
                <button className="header-button-login">Login</button>
            </div>
        </div>
    )
}

export default Header;
