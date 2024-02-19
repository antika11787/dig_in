'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import './index.scss';

const SideBar = () => {
    const pathName = usePathname();
    const role = useSelector((state: any) => state.user.role);
    return (
        <div className='sidebar-container'>
            {role === 'admin' ? (
                <>
                    <h2 className='sidebar-header'>Admin dashboard</h2>
                    <div className='sidebar-links'>
                        <Link href={'/profile/admin/manageCategory'} className={`sidebar-link ${pathName.endsWith('/manageCategory') ? 'active' : ''}`}>Categories</Link>
                        <Link href={'/profile/admin/manageItems'} className={`sidebar-link ${pathName.endsWith('/manageItems') ? 'active' : ''}`}>Items</Link>
                        <Link href={'/profile/admin/manageUsers'} className={`sidebar-link ${pathName.endsWith('/manageUsers') ? 'active' : ''}`}>Users</Link>
                        <Link href={'/profile/admin/manageBlogs'} className={`sidebar-link ${pathName.endsWith('/manageBlogs') ? 'active' : ''}`}>Blogs</Link>
                        <Link href={'/profile/admin/manageOrders'} className={`sidebar-link ${pathName.endsWith('/manageOrders') ? 'active' : ''}`}>Orders</Link>
                    </div>
                </>
            ) : role === 'customer' ? (
                <>
                    <h2 className='sidebar-header'>User dashboard</h2>
                    <div className='sidebar-links'>
                        <Link href={'/profile/user/myOrders'} className={`sidebar-link ${pathName.endsWith('/myOrders') ? 'active' : ''}`}>My Orders</Link>
                        {/* <Link href={'/profile/user/myCart'} className='sidebar-link'>My Cart</Link> */}
                    </div>
                </>
            ) : role === 'author' ? (
                <>
                    <h2 className='sidebar-header'>Author dashboard</h2>
                    <div className='sidebar-links'>
                        <Link href={'/profile/author/myBlogs'} className={`sidebar-link ${pathName.endsWith('/myBlogs') ? 'active' : ''}`}>My Blogs</Link>
                    </div>
                </>
            ) : null}
        </div>
    )
}

export default SideBar;
