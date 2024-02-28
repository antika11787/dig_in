'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { MdSpaceDashboard } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { IoFastFoodOutline } from "react-icons/io5";
import { LuUsers2 } from "react-icons/lu";
import { IoNewspaperOutline } from "react-icons/io5";
import { TbShoppingCartCheck } from "react-icons/tb";
import './index.scss';

const SideBar = () => {
    const pathName = usePathname();
    const role = useSelector((state: any) => state.user.role);
    return (
        <div className='sidebar-container'>
            <div className='sidebar-header-container'>
                <MdSpaceDashboard className='dashboard-icon' />
                <h2 className='sidebar-header'>Dashboard</h2>
            </div>
            {role === 'admin' ? (
                <>
                    <div className='sidebar-links'>
                        <div className={`sidebar-link-container ${pathName.endsWith('/manageCategory') ? 'active' : ''}`}>
                            <BiCategory className='sidebar-link-icon' />
                            <Link
                                href={'/profile/admin/manageCategory'}
                                className='sidebar-link'>
                                Categories
                            </Link>
                        </div>
                        <div className={`sidebar-link-container ${pathName.endsWith('/manageItems') ? 'active' : ''}`}>
                            <IoFastFoodOutline className='sidebar-link-icon' />
                            <Link
                                href={'/profile/admin/manageItems'}
                                className='sidebar-link'>
                                Items
                            </Link>
                        </div>
                        <div className={`sidebar-link-container ${pathName.endsWith('/manageUsers') ? 'active' : ''}`}>
                            <LuUsers2 className='sidebar-link-icon' />
                            <Link
                                href={'/profile/admin/manageUsers'}
                                className='sidebar-link'>
                                Users
                            </Link>
                        </div>
                        <div className={`sidebar-link-container ${pathName.endsWith('/manageBlogs') ? 'active' : ''}`}>
                            <IoNewspaperOutline className='sidebar-link-icon' />
                            <Link
                                href={'/profile/admin/manageBlogs'}
                                className='sidebar-link'>
                                Blogs
                            </Link>
                        </div>
                        <div className={`sidebar-link-container ${pathName.endsWith('/manageOrders') ? 'active' : ''}`}>
                            <TbShoppingCartCheck className='sidebar-link-icon' />
                            <Link
                                href={'/profile/admin/manageOrders'}
                                className='sidebar-link'>
                                Orders
                            </Link>
                        </div>
                    </div>
                </>
            ) : role === 'customer' ? (
                <>
                    <div className='sidebar-links'>
                        <div className={`sidebar-link-container ${pathName.endsWith('/myOrders') ? 'active' : ''}`}>
                            <TbShoppingCartCheck className='sidebar-link-icon' />
                            <Link
                                href={'/profile/user/myOrders'}
                                className='sidebar-link'>
                                My orders
                            </Link>
                        </div>
                    </div>
                </>
            ) : role === 'author' ? (
                <>
                    <div className='sidebar-links'>
                        <div className={`sidebar-link-container ${pathName.endsWith('/myBlogs') ? 'active' : ''}`}>
                            <IoNewspaperOutline className='sidebar-link-icon' />
                            <Link
                                href={'/profile/author/myBlogs'}
                                className='sidebar-link'>
                                Blogs
                            </Link>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    )
}

export default SideBar;