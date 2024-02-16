'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import './index.scss';

const SideBar = () => {
    const role = useSelector((state: any) => state.user.role);
    return (
        <div className='sidebar-container'>
            {role === 'admin' ? (
                <>
                    <h3 className='sidebar-header'>Admin dashboard</h3>
                    <div className='sidebar-links'>
                        <Link href={'/profile/admin/manageCategory'} className='sidebar-link'>Categories</Link>
                        <Link href={'/profile/admin/manageItems'} className='sidebar-link'>Items</Link>
                        <Link href={'/profile/admin/manageUsers'} className='sidebar-link'>Users</Link>
                        <Link href={'/profile/admin/manageBlogs'} className='sidebar-link'>Blogs</Link>
                        <Link href={'/profile/admin/manageOrders'} className='sidebar-link'>Orders</Link>
                    </div>
                </>
            ) : role === 'customer' ? (
                <>
                    <h3 className='sidebar-header'>User dashboard</h3>
                    <div className='sidebar-links'>
                        <Link href={'/profile/user/myOrders'} className='sidebar-link'>My Orders</Link>
                        {/* <Link href={'/profile/user/myCart'} className='sidebar-link'>My Cart</Link> */}
                    </div>
                </>
            ) : role === 'author' ? (
                <>
                    <h3 className='sidebar-header'>Author dashboard</h3>
                    <div className='sidebar-links'>
                        <Link href={'/profile/author/myBlogs'} className='sidebar-link'>My Blogs</Link>
                    </div>
                </>
            ) : null}
        </div>
    )
}

export default SideBar;
